import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  status: string;
  label: string;
  deals: Array<{
    id: number;
    name: string;
    propertyAddress: string;
    sentToTcAt: string | null;
  }>;
  isActive?: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    new: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
    under_review: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
    posted: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    offer_accepted: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
    closed: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
    dead: { bg: "bg-gray-200", text: "text-gray-700", border: "border-gray-400" },
  };
  return colors[status] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
};

export function KanbanColumn({ status, label, deals, isActive = false }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const colors = getStatusColor(status);
  const dealIds = deals.map((deal) => deal.id);

  return (
    <div className="flex flex-col h-full min-w-[180px]">
      {/* Column Header */}
      <div
        className={`${colors.bg} ${colors.text} ${colors.border} border-2 rounded-t-xl px-3 py-2 shadow-sm`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-xs uppercase tracking-wide truncate flex-1">{label}</h3>
          <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold shadow-sm flex-shrink-0">
            {deals.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 bg-gray-50 rounded-b-xl border-2 border-t-0 ${colors.border} p-3 overflow-y-auto transition-all duration-200 ${
          isActive || isOver 
            ? "bg-primary-50 ring-2 ring-primary-400 ring-inset shadow-lg" 
            : ""
        }`}
        style={{ minHeight: "600px", maxHeight: "calc(100vh - 250px)" }}
      >
        <SortableContext items={dealIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {deals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-xs font-medium">No deals</p>
              </div>
            ) : (
              deals.map((deal) => <KanbanCard key={deal.id} deal={deal} />)
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
