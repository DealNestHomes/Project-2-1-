import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Save, X, DollarSign, Calendar } from "lucide-react";
import { DatePicker } from "~/components/DatePicker";

interface DealDetailsEditFormProps {
  dealId: number;
  initialData: {
    closingDate: Date | null;
    inspectionPeriodExpiration: Date | null;
    occupancy: string | null;
    propertyCondition: string | null;
    propertyAccess: string | null;
    contractPrice: string;
    arv: string;
    estimatedRepairs: string;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function DealDetailsEditForm({
  dealId,
  initialData,
  onCancel,
  onSuccess,
}: DealDetailsEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Deal details updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update deal details");
      },
    }),
  );

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    // Use UTC methods since dates are stored as UTC midnight on the server
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    closingDate: string;
    inspectionPeriodExpiration: string;
    occupancy: string;
    propertyCondition: string;
    propertyAccess: string;
    contractPrice: string;
    arv: string;
    estimatedRepairs: string;
  }>({
    defaultValues: {
      closingDate: formatDateForInput(initialData.closingDate),
      inspectionPeriodExpiration: formatDateForInput(initialData.inspectionPeriodExpiration),
      occupancy: initialData.occupancy || "",
      propertyCondition: initialData.propertyCondition || "",
      propertyAccess: initialData.propertyAccess || "",
      contractPrice: initialData.contractPrice,
      arv: initialData.arv,
      estimatedRepairs: initialData.estimatedRepairs,
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate({
      authToken: token!,
      dealId,
      closingDate: data.closingDate || null,
      inspectionPeriodExpiration: data.inspectionPeriodExpiration || null,
      occupancy: data.occupancy || null,
      propertyCondition: data.propertyCondition || null,
      propertyAccess: data.propertyAccess || null,
      contractPrice: data.contractPrice.replace(/,/g, ""),
      arv: data.arv.replace(/,/g, ""),
      estimatedRepairs: data.estimatedRepairs.replace(/,/g, ""),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Contract Price */}
        <div>
          <label
            htmlFor="contractPrice"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4 text-green-600" />
            Contract Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base pointer-events-none">
              $
            </span>
            <input
              id="contractPrice"
              type="text"
              inputMode="numeric"
              {...register("contractPrice", {
                required: "Contract price is required",
                pattern: {
                  value: /^[\d,\.]+$/,
                  message: "Must contain only numbers",
                },
              })}
              placeholder="150,000"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 pl-9 text-base min-h-[52px]"
            />
          </div>
          {errors.contractPrice && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.contractPrice.message}
            </p>
          )}
        </div>

        {/* ARV */}
        <div>
          <label
            htmlFor="arv"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4 text-green-600" />
            ARV (After Repair Value)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base pointer-events-none">
              $
            </span>
            <input
              id="arv"
              type="text"
              inputMode="numeric"
              {...register("arv", {
                required: "ARV is required",
                pattern: {
                  value: /^[\d,\.]+$/,
                  message: "Must contain only numbers",
                },
              })}
              placeholder="200,000"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 pl-9 text-base min-h-[52px]"
            />
          </div>
          {errors.arv && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.arv.message}
            </p>
          )}
        </div>

        {/* Estimated Repairs */}
        <div>
          <label
            htmlFor="estimatedRepairs"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4 text-green-600" />
            Estimated Repairs
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base pointer-events-none">
              $
            </span>
            <input
              id="estimatedRepairs"
              type="text"
              inputMode="numeric"
              {...register("estimatedRepairs", {
                required: "Estimated repairs is required",
                pattern: {
                  value: /^[\d,\.]+$/,
                  message: "Must contain only numbers",
                },
              })}
              placeholder="50,000"
              className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 pl-9 text-base min-h-[52px]"
            />
          </div>
          {errors.estimatedRepairs && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.estimatedRepairs.message}
            </p>
          )}
        </div>

        {/* Closing Date */}
        <div>
          <DatePicker
            name="closingDate"
            control={control}
            label="Closing Date"
            placeholder="Select date"
            colorScheme="accent"
          />
        </div>

        {/* Inspection Period Expiration */}
        <div>
          <DatePicker
            name="inspectionPeriodExpiration"
            control={control}
            label="Inspection Period Expiration"
            placeholder="Select date"
            colorScheme="accent"
          />
        </div>

        {/* Occupancy */}
        <div>
          <label
            htmlFor="occupancy"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Occupancy
          </label>
          <select
            id="occupancy"
            {...register("occupancy")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] bg-white"
          >
            <option value="">Select occupancy</option>
            <option value="Owner-Occupied">Owner-Occupied</option>
            <option value="Tenant-Occupied">Tenant-Occupied</option>
            <option value="Vacant">Vacant</option>
          </select>
        </div>

        {/* Property Condition */}
        <div>
          <label
            htmlFor="propertyCondition"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Property Condition
          </label>
          <select
            id="propertyCondition"
            {...register("propertyCondition")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] bg-white"
          >
            <option value="">Select condition</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Needs Major Repairs">Needs Major Repairs</option>
          </select>
        </div>

        {/* Property Access */}
        <div className="sm:col-span-2">
          <label
            htmlFor="propertyAccess"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Property Access
          </label>
          <input
            id="propertyAccess"
            type="text"
            {...register("propertyAccess")}
            placeholder="Lockbox code, key location, etc."
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t-2 border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 min-h-[48px]"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
        >
          {updateMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
