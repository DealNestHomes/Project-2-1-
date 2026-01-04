import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import { KanbanBoard } from "~/components/kanban/KanbanBoard";
import { LayoutGrid, FileText } from "lucide-react";

export const Route = createFileRoute("/staff/board/")({
  component: StaffBoardPage,
});

function StaffBoardPage() {
  const trpc = useTRPC();
  const token = useAuthStore((state) => state.token);

  const dealsQuery = useQuery(
    trpc.listDealSubmissions.queryOptions({
      authToken: token!,
      limit: 100,
    })
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50/50 to-white rounded-xl p-5 md:p-6 shadow-md border-2 border-primary-100 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Deal Board</h1>
            <p className="text-gray-600 text-base md:text-lg">
              Drag and drop deals to update their status
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {dealsQuery.data?.deals.length || 0}
              </div>
              <div className="text-xs text-gray-600 font-medium">Total Deals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      {dealsQuery.isLoading ? (
        <div className="bg-white rounded-xl shadow-md p-16 text-center border-2 border-gray-100 animate-in fade-in duration-300">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
          <p className="text-base text-gray-600 font-medium">Loading deals...</p>
        </div>
      ) : dealsQuery.error ? (
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-xl p-8 text-center shadow-md animate-in fade-in duration-300">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-800 text-base font-semibold">Error loading deals</p>
          <p className="text-red-700 mt-2 text-sm">{dealsQuery.error.message}</p>
        </div>
      ) : dealsQuery.data?.deals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-16 text-center border-2 border-gray-100 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-base font-medium">No deals found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-3 md:p-4 border-2 border-gray-100">
          <KanbanBoard deals={dealsQuery.data?.deals || []} />
        </div>
      )}
    </div>
  );
}
