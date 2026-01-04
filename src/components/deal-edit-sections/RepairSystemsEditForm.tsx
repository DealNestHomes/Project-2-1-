import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Save, X, Wrench } from "lucide-react";

interface RepairSystemsEditFormProps {
  dealId: number;
  initialData: {
    repairEstimateMin: string | null;
    repairEstimateMax: string | null;
    roofAge: string | null;
    acType: string | null;
    heatingSystemType: string | null;
    heatingSystemAge: string | null;
    foundationType: string | null;
    foundationCondition: string | null;
    parkingType: string | null;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function RepairSystemsEditForm({
  dealId,
  initialData,
  onCancel,
  onSuccess,
}: RepairSystemsEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Repair & systems information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update repair & systems information");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    repairEstimateMin: string;
    repairEstimateMax: string;
    roofAge: string;
    acType: string;
    heatingSystemType: string;
    heatingSystemAge: string;
    foundationType: string;
    foundationCondition: string;
    parkingType: string;
  }>({
    defaultValues: {
      repairEstimateMin: initialData.repairEstimateMin || "",
      repairEstimateMax: initialData.repairEstimateMax || "",
      roofAge: initialData.roofAge || "",
      acType: initialData.acType || "",
      heatingSystemType: initialData.heatingSystemType || "",
      heatingSystemAge: initialData.heatingSystemAge || "",
      foundationType: initialData.foundationType || "",
      foundationCondition: initialData.foundationCondition || "",
      parkingType: initialData.parkingType || "",
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate({
      authToken: token!,
      dealId,
      repairEstimateMin: data.repairEstimateMin || null,
      repairEstimateMax: data.repairEstimateMax || null,
      roofAge: data.roofAge || null,
      acType: data.acType || null,
      heatingSystemType: data.heatingSystemType || null,
      heatingSystemAge: data.heatingSystemAge || null,
      foundationType: data.foundationType || null,
      foundationCondition: data.foundationCondition || null,
      parkingType: data.parkingType || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
        {/* Repair Estimate Min */}
        <div>
          <label
            htmlFor="repairEstimateMin"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Wrench className="h-4 w-4 text-accent-600" />
            Repair Estimate (Min)
          </label>
          <input
            id="repairEstimateMin"
            type="text"
            {...register("repairEstimateMin")}
            placeholder="10,000"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Repair Estimate Max */}
        <div>
          <label
            htmlFor="repairEstimateMax"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Repair Estimate (Max)
          </label>
          <input
            id="repairEstimateMax"
            type="text"
            {...register("repairEstimateMax")}
            placeholder="20,000"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Roof Age */}
        <div>
          <label
            htmlFor="roofAge"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Roof Age
          </label>
          <input
            id="roofAge"
            type="text"
            {...register("roofAge")}
            placeholder="5 years"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* AC Type */}
        <div>
          <label
            htmlFor="acType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            AC Type
          </label>
          <input
            id="acType"
            type="text"
            {...register("acType")}
            placeholder="Central Air"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Heating System Type */}
        <div>
          <label
            htmlFor="heatingSystemType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Heating System Type
          </label>
          <input
            id="heatingSystemType"
            type="text"
            {...register("heatingSystemType")}
            placeholder="Gas Furnace"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Heating System Age */}
        <div>
          <label
            htmlFor="heatingSystemAge"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Heating System Age
          </label>
          <input
            id="heatingSystemAge"
            type="text"
            {...register("heatingSystemAge")}
            placeholder="3 years"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Foundation Type */}
        <div>
          <label
            htmlFor="foundationType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Foundation Type
          </label>
          <input
            id="foundationType"
            type="text"
            {...register("foundationType")}
            placeholder="Slab"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Foundation Condition */}
        <div>
          <label
            htmlFor="foundationCondition"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Foundation Condition
          </label>
          <input
            id="foundationCondition"
            type="text"
            {...register("foundationCondition")}
            placeholder="Good"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Parking Type */}
        <div className="sm:col-span-2">
          <label
            htmlFor="parkingType"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Parking Type
          </label>
          <input
            id="parkingType"
            type="text"
            {...register("parkingType")}
            placeholder="2-car garage"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
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
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-6 py-3 rounded-xl font-bold hover:from-accent-700 hover:to-accent-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
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
