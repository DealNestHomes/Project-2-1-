import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin, DollarSign, AlertCircle } from "lucide-react";

interface CalendarViewProps {
  deals: Array<{
    id: number;
    name: string;
    propertyAddress: string;
    contractPrice: string;
    assignmentProfit: string | null;
    closingDate: string | null;
    status: string;
    email: string;
  }>;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(date: Date): string {
  // Use UTC methods since dates are stored as UTC midnight on the server
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: string | null | undefined): string {
  if (!value) return "N/A";
  
  // Remove any non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, "");
  const number = parseFloat(numericValue);
  
  if (isNaN(number)) return "N/A";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function CalendarView({ deals }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Group deals by closing date
  // Dates are stored as UTC midnight, so we parse them as UTC to prevent timezone shifts
  const dealsByDate = useMemo(() => {
    const grouped: Record<string, typeof deals> = {};
    
    deals.forEach((deal) => {
      if (deal.closingDate) {
        // Parse the ISO date string and format using UTC methods
        const dateKey = formatDateKey(new Date(deal.closingDate));
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(deal);
      }
    });
    
    return grouped;
  }, [deals]);
  
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const today = new Date();
  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Generate calendar days array
  const calendarDays = useMemo(() => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = formatDateKey(date);
      const dealsOnDate = dealsByDate[dateKey] || [];
      
      days.push({
        day,
        date,
        dateKey,
        deals: dealsOnDate,
        isToday: isToday(day),
      });
    }
    
    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfMonth, dealsByDate]);
  
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all shadow-sm hover:shadow-md"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all shadow-md hover:shadow-lg min-h-[44px]"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 transition-all shadow-sm hover:shadow-md"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((dayName) => (
            <div
              key={dayName}
              className="text-center text-xs md:text-sm font-bold text-gray-600 uppercase tracking-wide py-1.5"
            >
              <span className="hidden sm:inline">{dayName}</span>
              <span className="sm:hidden">{dayName.slice(0, 1)}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              className={`min-h-[120px] md:min-h-[140px] p-2 rounded-xl border-2 transition-all ${
                dayData
                  ? dayData.isToday
                    ? "bg-primary-50 border-primary-300"
                    : "bg-gray-50 border-gray-200 hover:border-primary-200 hover:bg-gray-50/50"
                  : "bg-transparent border-transparent"
              }`}
            >
              {dayData && (
                <>
                  <div
                    className={`text-xs md:text-sm font-bold mb-2 ${
                      dayData.isToday
                        ? "text-primary-700"
                        : "text-gray-700"
                    }`}
                  >
                    {dayData.day}
                  </div>
                  <div className="space-y-0.5 max-h-[85px] overflow-y-auto">
                    {dayData.deals.map((deal) => (
                      <Link
                        key={deal.id}
                        to="/staff/$dealId"
                        params={{ dealId: deal.id.toString() }}
                        className="block group"
                      >
                        <div className="bg-white rounded-lg p-1.5 md:p-2 shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-primary-300 group-hover:-translate-y-0.5">
                          <div className="text-[10px] md:text-xs font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                            {deal.name}
                          </div>
                          <div className="text-[9px] md:text-[10px] text-gray-600 truncate flex items-center mt-0.5">
                            <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 flex-shrink-0" />
                            <span className="truncate min-w-0">{deal.propertyAddress}</span>
                          </div>
                          <div className="text-[9px] md:text-xs text-gray-600 truncate flex items-center mt-0.5">
                            <DollarSign className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 flex-shrink-0" />
                            <span className="truncate">{formatCurrency(deal.assignmentProfit)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
