import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { Control, Controller, FieldError } from "react-hook-form";

interface DatePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  required?: boolean;
  error?: FieldError;
  placeholder?: string;
  colorScheme?: "primary" | "accent";
  disableUnknown?: boolean;
}

const CustomInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    onClick?: () => void;
    onUnknownClick?: () => void;
    placeholder?: string;
    hasError?: boolean;
    colorScheme?: "primary" | "accent";
  }
>(({ value, onClick, onUnknownClick, placeholder, hasError, colorScheme = "primary" }, ref) => {
  const focusBorderClass = colorScheme === "primary" ? "focus:border-primary-500" : "focus:border-accent-500";
  const focusRingClass = colorScheme === "primary" ? "focus:ring-primary-100" : "focus:ring-accent-100";
  const buttonColorClass = colorScheme === "primary" 
    ? "text-primary-600 hover:text-primary-700 hover:bg-primary-50" 
    : "text-accent-600 hover:text-accent-700 hover:bg-accent-50";

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={value === "Unknown" ? "Unknown" : value}
          onClick={onClick}
          placeholder={placeholder}
          readOnly
          className={`w-full rounded-xl border-2 ${
            hasError ? "border-red-300" : "border-gray-200"
          } shadow-sm ${focusBorderClass} focus:ring-4 ${focusRingClass} text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 pr-12 cursor-pointer text-base min-h-[52px] touch-manipulation placeholder:text-gray-400`}
        />
        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {onUnknownClick && (
        <button
          type="button"
          onClick={onUnknownClick}
          className={`w-full sm:w-auto text-sm font-semibold ${buttonColorClass} transition-all px-4 py-2.5 rounded-lg border-2 border-transparent hover:border-current min-h-[44px] sm:min-h-0 touch-manipulation flex items-center justify-center gap-2`}
        >
          {value === "Unknown" ? (
            <>
              <Calendar className="h-4 w-4" />
              <span>Select a date instead</span>
            </>
          ) : (
            <>
              <span>❓</span>
              <span>Mark as Unknown</span>
            </>
          )}
        </button>
      )}
    </div>
  );
});
CustomInput.displayName = "CustomInput";

// Helper function to parse YYYY-MM-DD string as a local date (not UTC)
// This prevents timezone shifts when displaying dates
const parseLocalDate = (dateString: string): Date | null => {
  if (!dateString || dateString === "Unknown") return null;
  
  const parts = dateString.split("-");
  if (parts.length !== 3) return null;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  
  return new Date(year, month, day);
};

export function DatePicker({
  name,
  control,
  label,
  required = false,
  error,
  placeholder = "Select date",
  colorScheme = "primary",
  disableUnknown = false,
}: DatePickerProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-800 mb-2.5"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const handleUnknownClick = () => {
            if (field.value === "Unknown") {
              field.onChange("");
            } else {
              field.onChange("Unknown");
            }
          };

          return (
            <ReactDatePicker
              selected={parseLocalDate(field.value)}
              onChange={(date: Date | null) => {
                // Convert to YYYY-MM-DD format for backend compatibility
                if (date) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  field.onChange(`${year}-${month}-${day}`);
                } else {
                  field.onChange("");
                }
              }}
              dateFormat="MM/dd/yyyy"
              customInput={
                <CustomInput 
                  hasError={!!error} 
                  placeholder={placeholder}
                  onUnknownClick={disableUnknown ? undefined : handleUnknownClick}
                  colorScheme={colorScheme}
                />
              }
              showPopperArrow={false}
              popperClassName="date-picker-popper"
              calendarClassName="date-picker-calendar"
              disabled={!disableUnknown && field.value === "Unknown"}
            />
          );
        }}
      />
      {error && (
        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
          {error.message}
        </p>
      )}
    </div>
  );
}
