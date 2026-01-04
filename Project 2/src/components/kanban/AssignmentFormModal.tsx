import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, User, Mail, DollarSign } from "lucide-react";
import { DatePicker } from "~/components/DatePicker";
import { PhoneInput } from "~/components/PhoneInput";

const assignmentFormSchema = z.object({
  closingDate: z.string().optional().or(z.literal("")),
  assignmentProfit: z.string().optional().or(z.literal("")).refine(
    (val) => !val || /^[\d,\.]+$/.test(val),
    { message: "Assignment profit must contain only numbers" }
  ),
  buyerName: z.string().optional().or(z.literal("")),
  buyerPhone: z.string().optional().or(z.literal("")),
  buyerEmail: z.string().email("Valid email address is required").optional().or(z.literal("")),
});

type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

interface AssignmentFormModalProps {
  isOpen: boolean;
  dealName: string;
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AssignmentFormModal({
  isOpen,
  dealName,
  onSubmit,
  onCancel,
  isSubmitting,
}: AssignmentFormModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/50 border-b-2 border-primary-100 p-5 md:p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Assignment Details Required
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Please provide the assignment details for:{" "}
                <span className="font-semibold text-gray-900 break-words">{dealName}</span>
              </p>
            </div>
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-6 space-y-5">
          {/* Closing Date */}
          <DatePicker
            name="closingDate"
            control={control}
            label="Closing Date"
            required={false}
            error={errors.closingDate}
            placeholder="Select closing date"
            disableUnknown
          />

          {/* Assignment Profit */}
          <div>
            <label
              htmlFor="assignmentProfit"
              className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4 text-primary-600" />
              Assignment Profit
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base pointer-events-none">
                $
              </span>
              <input
                id="assignmentProfit"
                type="text"
                inputMode="numeric"
                {...register("assignmentProfit")}
                placeholder="10,000"
                className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 pl-9 text-base min-h-[52px] placeholder:text-gray-400 font-semibold"
              />
            </div>
            {errors.assignmentProfit && (
              <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                {errors.assignmentProfit.message}
              </p>
            )}
          </div>

          {/* Buyer Name */}
          <div>
            <label
              htmlFor="buyerName"
              className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
            >
              <User className="h-4 w-4 text-primary-600" />
              Buyer Full Name
            </label>
            <input
              id="buyerName"
              type="text"
              {...register("buyerName")}
              placeholder="John Smith"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] placeholder:text-gray-400"
            />
            {errors.buyerName && (
              <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                {errors.buyerName.message}
              </p>
            )}
          </div>

          {/* Buyer Phone */}
          <PhoneInput
            name="buyerPhone"
            control={control}
            label="Buyer Phone Number"
            required={false}
            error={errors.buyerPhone}
            placeholder="(555) 123-4567"
          />

          {/* Buyer Email */}
          <div>
            <label
              htmlFor="buyerEmail"
              className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-primary-600" />
              Buyer Email Address
            </label>
            <input
              id="buyerEmail"
              type="email"
              inputMode="email"
              {...register("buyerEmail")}
              placeholder="buyer@example.com"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] placeholder:text-gray-400"
            />
            {errors.buyerEmail && (
              <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                {errors.buyerEmail.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden min-h-[48px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </span>
              ) : (
                "Assign Deal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
