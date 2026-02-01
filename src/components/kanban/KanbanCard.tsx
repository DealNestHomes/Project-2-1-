import { Link } from "@tanstack/react-router";
import { MapPin, Send, FileText } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanCardProps {
  deal: {
    id: number;
    name: string;
    propertyAddress: string;
    sentToTcAt: string | null;
    sentJvAgreementAt: string | null;
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
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 flex-1 min-w-0 mr-1">
                {deal.name}
              </h3>
              <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                {deal.sentToTcAt && (
                  <div className="flex-shrink-0 bg-white border border-green-200 px-1 py-0.5 rounded flex items-center gap-0.5 shadow-sm" title={`Sent to TC on ${new Date(deal.sentToTcAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}`}>
                    <Send className="w-2 h-2 text-green-600" />
                    <span className="text-[8px] font-bold text-green-700 uppercase tracking-wide leading-none">TC</span>
                  </div>
                )}
                {deal.sentJvAgreementAt && (
                  <div className="flex-shrink-0 bg-white border border-blue-200 px-1 py-0.5 rounded flex items-center gap-0.5 shadow-sm" title={`JV Sent on ${new Date(deal.sentJvAgreementAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}`}>
                    <Send className="w-2 h-2 text-blue-600" />
                    <span className="text-[8px] font-bold text-blue-700 uppercase tracking-wide leading-none">JV</span>
                  </div>
                )}
                {(deal as any).sentDealDescriptionAt && (
                  <div className="flex-shrink-0 bg-white border border-purple-200 px-1 py-0.5 rounded flex items-center gap-0.5 shadow-sm" title={`Deal Description Sent on ${new Date((deal as any).sentDealDescriptionAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}`}>
                    <FileText className="w-2 h-2 text-purple-600" />
                    <span className="text-[8px] font-bold text-purple-700 uppercase tracking-wide leading-none">DESC</span>
                  </div>
                )}
              </div>
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
