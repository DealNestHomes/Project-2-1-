import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { AssignmentFormModal } from "./AssignmentFormModal";

interface KanbanBoardProps {
  deals: Array<{
    id: number;
    name: string;
    propertyAddress: string;
    status: string;
    sentToTcAt: string | null;
  }>;
}

const statusColumns = [
  { value: "new", label: "New Deals" },
  { value: "under_review", label: "Under Review" },
  { value: "posted", label: "Posted" },
  { value: "offer_accepted", label: "Assigned" },
  { value: "closed", label: "Sold" },
  { value: "dead", label: "Dead Deals" },
];

export function KanbanBoard({ deals }: KanbanBoardProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const [activeDeal, setActiveDeal] = useState<KanbanBoardProps["deals"][0] | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [dealToAssign, setDealToAssign] = useState<{
    id: number;
    name: string;
    status: string;
  } | null>(null);

  const updateStatusMutation = useMutation(
    trpc.updateDealStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Deal status updated!");
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update deal status");
      },
    })
  );

  // Group deals by status
  const dealsByStatus = useMemo(() => {
    const grouped: Record<string, typeof deals> = {};
    statusColumns.forEach((column) => {
      grouped[column.value] = deals.filter((deal) => deal.status === column.value);
    });
    return grouped;
  }, [deals]);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px of movement required to start drag (reduced from 8px for better sensitivity)
      },
    })
  );

  // Custom collision detection that prioritizes pointer position over closest corners
  const collisionDetectionStrategy = (args: any) => {
    // First, try to find collisions using pointer position
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    
    // Fallback to rectangle intersection for better drop zone coverage
    return rectIntersection(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find((d) => d.id === active.id);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    
    if (!over) {
      setActiveColumn(null);
      return;
    }

    // The over.id could be either a column status or a deal ID
    // If it's a number, it's a deal ID, so we need to find which column it belongs to
    const overId = over.id;
    
    if (typeof overId === 'string') {
      // It's a column ID
      setActiveColumn(overId);
    } else {
      // It's a deal ID, find which column it belongs to
      const deal = deals.find((d) => d.id === overId);
      if (deal) {
        setActiveColumn(deal.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);
    setActiveColumn(null);

    if (!over) return;

    const dealId = active.id as number;
    let newStatus: string;

    // The over.id could be either a column status (string) or a deal ID (number)
    if (typeof over.id === 'string') {
      // It's a column ID
      newStatus = over.id;
    } else {
      // It's a deal ID, find which column it belongs to
      const targetDeal = deals.find((d) => d.id === over.id);
      if (!targetDeal) {
        console.error(`Could not find target deal with ID: ${over.id}`);
        return;
      }
      newStatus = targetDeal.status;
    }

    // Validate that the status is one of the expected column values
    const isValidStatus = statusColumns.some((col) => col.value === newStatus);
    if (!isValidStatus) {
      console.error(`Invalid status received from drag operation: ${newStatus}`);
      toast.error("Invalid status. Please try again.");
      return;
    }

    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    // Only update if status actually changed
    if (deal.status !== newStatus) {
      // If moving to offer_accepted, show assignment form modal
      if (newStatus === "offer_accepted") {
        setDealToAssign({
          id: dealId,
          name: deal.name,
          status: newStatus,
        });
        setAssignmentModalOpen(true);
      } else {
        // For other status changes, update immediately
        updateStatusMutation.mutate({
          authToken: token!,
          dealId,
          status: newStatus,
        });
      }
    }
  };

  const handleAssignmentSubmit = (data: {
    assignmentProfit: string;
    closingDate: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
  }) => {
    if (!dealToAssign) return;

    updateStatusMutation.mutate(
      {
        authToken: token!,
        dealId: dealToAssign.id,
        status: dealToAssign.status,
        assignmentProfit: data.assignmentProfit,
        closingDate: data.closingDate,
        buyerName: data.buyerName,
        buyerPhone: data.buyerPhone,
        buyerEmail: data.buyerEmail,
      },
      {
        onSuccess: () => {
          setAssignmentModalOpen(false);
          setDealToAssign(null);
        },
      }
    );
  };

  const handleAssignmentCancel = () => {
    setAssignmentModalOpen(false);
    setDealToAssign(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Horizontal scroll container for mobile */}
      <div className="overflow-x-auto -mx-2 px-2 pb-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 min-w-[640px] lg:min-w-0">
          {statusColumns.map((column) => (
            <KanbanColumn
              key={column.value}
              status={column.value}
              label={column.label}
              deals={dealsByStatus[column.value] || []}
              isActive={activeColumn === column.value}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div className="rotate-3 scale-105">
            <KanbanCard deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>

      <AssignmentFormModal
        isOpen={assignmentModalOpen}
        dealName={dealToAssign?.name || ""}
        onSubmit={handleAssignmentSubmit}
        onCancel={handleAssignmentCancel}
        isSubmitting={updateStatusMutation.isPending}
      />
    </DndContext>
  );
}
