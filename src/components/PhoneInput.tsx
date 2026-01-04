import { Control, Controller, FieldError } from "react-hook-form";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  name: string;
  control: Control<any>;
  error?: FieldError;
  label: string;
  placeholder?: string;
  required?: boolean;
  colorScheme?: "primary" | "accent";
}

export function PhoneInput({
  name,
  control,
  error,
  label,
  placeholder = "(555) 123-4567",
  required = false,
  colorScheme = "primary",
}: PhoneInputProps) {
  // Format a string of digits into (999) 999-9999 format
  const formatPhoneNumber = (value: string): string => {
    // Get only digits
    const digits = value.replace(/\D/g, "");
    
    // Format based on length
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const iconColorClass = colorScheme === "primary" ? "text-primary-600" : "text-accent-600";
  const focusBorderClass = colorScheme === "primary" ? "focus:border-primary-500" : "focus:border-accent-500";
  const focusRingClass = colorScheme === "primary" ? "focus:ring-primary-100" : "focus:ring-accent-100";

  return (
    <div className="group">
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
      >
        <Phone className={`h-4 w-4 ${iconColorClass}`} />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref, ...field } }) => {
          // The value from form state is digits only
          const digitsOnly = typeof value === "string" ? value.replace(/\D/g, "") : "";
          const displayValue = formatPhoneNumber(digitsOnly);

          return (
            <input
              {...field}
              ref={ref}
              id={name}
              type="tel"
              inputMode="tel"
              placeholder={placeholder}
              value={displayValue}
              onChange={(e) => {
                // Extract only digits from the input
                const newDigits = e.target.value.replace(/\D/g, "");
                // Limit to 10 digits
                const limitedDigits = newDigits.slice(0, 10);
                // Store only digits in form state
                onChange(limitedDigits);
              }}
              className={`w-full rounded-xl border-2 border-gray-200 shadow-sm ${focusBorderClass} focus:ring-4 ${focusRingClass} text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400`}
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
