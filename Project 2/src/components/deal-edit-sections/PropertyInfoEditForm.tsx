import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import toast from "react-hot-toast";
import { Save, X, Home, MapPin } from "lucide-react";

interface PropertyInfoEditFormProps {
  dealId: number;
  initialData: {
    propertyAddress: string;
    zipCode: string;
    propertyType: string;
    bedrooms: number | null;
    baths: number | null;
    halfBaths: number | null;
    squareFootage: number | null;
    lotSize: number | null;
    lotSizeUnit: string | null;
    yearBuilt: number | null;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

export function PropertyInfoEditForm({
  dealId,
  initialData,
  onCancel,
  onSuccess,
}: PropertyInfoEditFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Property information updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update property information");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    propertyAddress: string;
    zipCode: string;
    propertyType: string;
    bedrooms: string;
    baths: string;
    halfBaths: string;
    squareFootage: string;
    lotSize: string;
    lotSizeUnit: string;
    yearBuilt: string;
  }>({
    defaultValues: {
      propertyAddress: initialData.propertyAddress,
      zipCode: initialData.zipCode,
      propertyType: initialData.propertyType,
      bedrooms: initialData.bedrooms?.toString() || "",
      baths: initialData.baths?.toString() || "",
      halfBaths: initialData.halfBaths?.toString() || "",
      squareFootage: initialData.squareFootage?.toString() || "",
      lotSize: initialData.lotSize?.toString() || "",
      lotSizeUnit: initialData.lotSizeUnit || "acres",
      yearBuilt: initialData.yearBuilt?.toString() || "",
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate({
      authToken: token!,
      dealId,
      propertyAddress: data.propertyAddress,
      zipCode: data.zipCode,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
      baths: data.baths ? parseInt(data.baths) : null,
      halfBaths: data.halfBaths ? parseInt(data.halfBaths) : null,
      squareFootage: data.squareFootage ? parseInt(data.squareFootage) : null,
      lotSize: data.lotSize ? parseFloat(data.lotSize) : null,
      lotSizeUnit: data.lotSizeUnit || null,
      yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
        {/* Property Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="propertyAddress"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-primary-600" />
            Property Address
          </label>
          <input
            id="propertyAddress"
            type="text"
            {...register("propertyAddress", { required: "Address is required" })}
            placeholder="123 Main St, City, State"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
          {errors.propertyAddress && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.propertyAddress.message}
            </p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <label
            htmlFor="zipCode"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            ZIP Code
          </label>
          <input
            id="zipCode"
            type="text"
            {...register("zipCode", { required: "ZIP code is required" })}
            placeholder="12345"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
          {errors.zipCode && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.zipCode.message}
            </p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2"
          >
            <Home className="h-4 w-4 text-primary-600" />
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType", { required: "Property type is required" })}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] bg-white"
          >
            <option value="">Select type</option>
            <option value="Single Family">Single Family</option>
            <option value="Multi-Family">Multi-Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Other">Other</option>
          </select>
          {errors.propertyType && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.propertyType.message}
            </p>
          )}
        </div>

        {/* Bedrooms */}
        <div>
          <label
            htmlFor="bedrooms"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Bedrooms
          </label>
          <input
            id="bedrooms"
            type="number"
            {...register("bedrooms")}
            placeholder="3"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Bathrooms */}
        <div>
          <label
            htmlFor="baths"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Full Bathrooms
          </label>
          <input
            id="baths"
            type="number"
            {...register("baths")}
            placeholder="2"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Half Bathrooms */}
        <div>
          <label
            htmlFor="halfBaths"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Half Bathrooms
          </label>
          <input
            id="halfBaths"
            type="number"
            {...register("halfBaths")}
            placeholder="1"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Square Footage */}
        <div>
          <label
            htmlFor="squareFootage"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Square Footage
          </label>
          <input
            id="squareFootage"
            type="number"
            {...register("squareFootage")}
            placeholder="2000"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Lot Size */}
        <div>
          <label
            htmlFor="lotSize"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Lot Size
          </label>
          <input
            id="lotSize"
            type="number"
            step="0.01"
            {...register("lotSize")}
            placeholder="0.25"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
          />
        </div>

        {/* Lot Size Unit */}
        <div>
          <label
            htmlFor="lotSizeUnit"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Lot Size Unit
          </label>
          <select
            id="lotSizeUnit"
            {...register("lotSizeUnit")}
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px] bg-white"
          >
            <option value="acres">Acres</option>
            <option value="sqft">Square Feet</option>
          </select>
        </div>

        {/* Year Built */}
        <div>
          <label
            htmlFor="yearBuilt"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Year Built
          </label>
          <input
            id="yearBuilt"
            type="number"
            {...register("yearBuilt")}
            placeholder="1990"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
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
