import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/useAuthStore";
import { useEffect } from "react";
import { LogOut, LayoutDashboard, Loader, LayoutGrid, Calendar } from "lucide-react";

export const Route = createFileRoute("/staff")({
  component: StaffLayout,
});

function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, hasHydrated } = useAuthStore();

  // Check if we're on the login page - if so, just render the outlet without layout or auth checks
  const isLoginPage = window.location.pathname === "/staff/login";
  
  if (isLoginPage) {
    return <Outlet />;
  }

  useEffect(() => {
    // Only redirect once hydration is complete
    if (hasHydrated() && !isAuthenticated()) {
      navigate({ to: "/staff/login" });
    }
  }, [hasHydrated, isAuthenticated, navigate]);

  // Show loading state while hydrating
  if (!hasHydrated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <Loader className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/staff/login" });
  };

  return (
    <div className="min-h-screen">
      {/* Staff Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 md:p-2.5 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  DealNest Staff Portal
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Deal Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-gray-200 hover:border-primary-200 min-h-[40px]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Navigation Tabs */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-2 py-2 md:py-3 overflow-x-auto">
            <Link
              to="/staff"
              className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap min-h-[44px] ${
                location.pathname === "/staff" || location.pathname === "/staff/"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              <span>Board</span>
            </Link>
            <Link
              to="/staff/calendar"
              className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap min-h-[44px] ${
                location.pathname === "/staff/calendar" || location.pathname === "/staff/calendar/"
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                  : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
