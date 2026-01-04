import { Link } from "@tanstack/react-router";
import { MapPin, Send } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanCardProps {
  deal: {
    id: number;
    name: string;
    propertyAddress: string;
    sentToTcAt: string | null;
  };
}

export function KanbanCard({ deal }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'z-50' : ''}`}
    >
      <Link
        to="/staff/$dealId"
        params={{ dealId: deal.id.toString() }}
        className="block group"
        onClick={(e) => {
          // Prevent navigation when dragging
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <div className="bg-white rounded-xl p-2.5 shadow-sm hover:shadow-md transition-all duration-200 border-2 border-gray-100 hover:border-primary-200 group-hover:-translate-y-0.5 cursor-pointer">
          <div className="space-y-2">
            {/* Title and Badge Row */}
            <div className="flex items-start gap-2">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1 min-w-0">
                {deal.name}
              </h3>
              {deal.sentToTcAt && (
                <div className="flex-shrink-0 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 px-1.5 py-0.5 rounded-md flex items-center gap-1" title={`Sent to TC on ${new Date(deal.sentToTcAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}`}>
                  <Send className="w-2.5 h-2.5 text-green-700" />
                  <span className="text-[9px] font-bold text-green-800 uppercase tracking-wide">TC</span>
                </div>
              )}
            </div>

            {/* Address Row */}
            <div className="flex items-start gap-1.5">
              <div className="bg-primary-50 p-1 rounded-lg flex-shrink-0 mt-0.5">
                <MapPin className="w-3 h-3 text-primary-600" />
              </div>
              <span className="text-gray-600 text-xs line-clamp-2 flex-1 min-w-0">
                {deal.propertyAddress}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
