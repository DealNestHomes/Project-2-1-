import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Save, X, FileText, Link } from "lucide-react";

interface AdditionalInfoEditFormProps {
  dealId: number;
  initialData: {
    additionalInfo: string | null;
    photoLink: string | null;
    photosNeeded: boolean;
    lockboxNeeded: boolean;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function AdditionalInfoEditForm({
  dealId,
  initialData,
  onCancel,
  onSuccess,
}: AdditionalInfoEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Additional information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update additional information");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    additionalInfo: string;
    photoLink: string;
    photosNeeded: boolean;
    lockboxNeeded: boolean;
  }>({
    defaultValues: {
      additionalInfo: initialData.additionalInfo || "",
      photoLink: initialData.photoLink || "",
      photosNeeded: initialData.photosNeeded,
      lockboxNeeded: initialData.lockboxNeeded,
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate({
      authToken: token!,
      dealId,
      additionalInfo: data.additionalInfo || null,
      photoLink: data.photoLink || null,
      photosNeeded: data.photosNeeded,
      lockboxNeeded: data.lockboxNeeded,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3 md:space-y-6">
        {/* Additional Notes */}
        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-primary-600" />
            Additional Notes
          </label>
          <textarea
            id="additionalInfo"
            {...register("additionalInfo")}
            rows={5}
            placeholder="Any additional information about the property or deal..."
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base resize-none"
          />
        </div>

        {/* Photo Link */}
        <div>
          <label
            htmlFor="photoLink"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Link className="h-4 w-4 text-primary-600" />
            Photo Link
          </label>
          <input
            id="photoLink"
            type="url"
            {...register("photoLink")}
            placeholder="https://drive.google.com/..."
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 flex items-center gap-3">
            <input
              id="photosNeeded"
              type="checkbox"
              {...register("photosNeeded")}
              className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
            />
            <label htmlFor="photosNeeded" className="text-sm font-bold text-gray-800 cursor-pointer">
              Photos Needed?
            </label>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100 flex items-center gap-3">
            <input
              id="lockboxNeeded"
              type="checkbox"
              {...register("lockboxNeeded")}
              className="w-5 h-5 rounded border-2 border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
            />
            <label htmlFor="lockboxNeeded" className="text-sm font-bold text-gray-800 cursor-pointer">
              Lockbox Needed?
            </label>
          </div>
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
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
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
