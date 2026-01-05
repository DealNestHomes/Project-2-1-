import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { FileText, Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface AdditionalInformationStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function AdditionalInformationStep({
  register,
  errors,
  setValue,
  watch,
}: AdditionalInformationStepProps) {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const trpc = useTRPC();
  const generatePresignedUrlMutation = useMutation(
    trpc.generatePresignedUploadUrl.mutationOptions()
  );

  const purchaseAgreementKey = watch("purchaseAgreementKey");

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      event.target.value = ""; // Reset input
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      event.target.value = ""; // Reset input
      return;
    }

    setUploadingFile(true);

    try {
      // Get presigned URL from backend
      const { presignedUrl, objectKey } = await generatePresignedUrlMutation.mutateAsync({
        filename: file.name,
      });

      // Upload file to Minio using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Store the object key in form state
      setValue("purchaseAgreementKey", objectKey);
      setUploadedFileName(file.name);
      toast.success("Purchase agreement uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Graceful degradation - show warning but don't block submission
      toast.error("File upload unavailable. You can proceed without uploading - just include the purchase agreement link in 'Additional Information' or email it separately.", {
        duration: 6000,
      });
      // Clear the file selection so users know it didn't upload
      setValue("purchaseAgreementKey", undefined);
      setUploadedFileName(null);
    } finally {
      setUploadingFile(false);
      event.target.value = ""; // Reset input to allow re-uploading same file
    }
  };

  const handleRemoveFile = () => {
    setValue("purchaseAgreementKey", undefined);
    setUploadedFileName(null);
    toast.success("File removed");
  };

  return (
    <FormStepContainer
      title="Additional Information"
      description="Provide any additional details that might be helpful for buyers. Enter 'Unknown' if information is not available."
      icon={<FileText className="h-6 w-6 text-white" />}
      colorScheme="primary"
    >
      <div className="space-y-4 md:space-y-5">
        <div>
          <label
            htmlFor="additionalInfo"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Additional Information <span className="text-red-500">*</span>
          </label>
          <textarea
            id="additionalInfo"
            {...register("additionalInfo")}
            rows={4}
            placeholder="Any other details about the property, deal structure, or special circumstances..."
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base resize-none touch-manipulation placeholder:text-gray-400"
          />
          {errors.additionalInfo && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.additionalInfo.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-primary-600 font-bold mt-0.5">→</span>
            <span>Share any relevant details that buyers should know</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="propertyAccess"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Property Access Instructions <span className="text-red-500">*</span>
          </label>
          <textarea
            id="propertyAccess"
            {...register("propertyAccess")}
            rows={4}
            placeholder="How can buyers access the property for viewing? (e.g., lockbox code, showing instructions, contact information)"
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base resize-none touch-manipulation placeholder:text-gray-400"
          />
          {errors.propertyAccess && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.propertyAccess.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-primary-600 font-bold mt-0.5">→</span>
            <span>Help buyers schedule viewings efficiently</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="photoLink"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Photo Link
          </label>
          <input
            id="photoLink"
            type="url"
            inputMode="url"
            {...register("photoLink")}
            placeholder="https://drive.google.com/... or https://dropbox.com/..."
            className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3.5 text-base min-h-[52px] touch-manipulation placeholder:text-gray-400"
          />
          {errors.photoLink && (
            <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
              {errors.photoLink.message as string}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-primary-600 font-bold mt-0.5">→</span>
            <span>Link to Google Drive, Dropbox, or other photo sharing service</span>
          </p>
        </div>

        <div>
          <label
            htmlFor="purchaseAgreement"
            className="block text-sm font-bold text-gray-800 mb-2.5"
          >
            Purchase Agreement (Optional)
          </label>

          {!purchaseAgreementKey ? (
            <div className="relative">
              <input
                id="purchaseAgreement"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={uploadingFile}
                className="hidden"
              />
              <label
                htmlFor="purchaseAgreement"
                className={`
                  flex items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed
                  ${uploadingFile ? "border-gray-300 bg-gray-50 cursor-not-allowed" : "border-primary-300 bg-primary-50/30 hover:bg-primary-50 hover:border-primary-400 cursor-pointer"}
                  transition-all px-4 py-6 text-base touch-manipulation
                `}
              >
                {uploadingFile ? (
                  <>
                    <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                    <span className="text-primary-700 font-semibold">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-primary-600" />
                    <span className="text-primary-700 font-semibold">Click to upload purchase agreement (PDF)</span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full rounded-xl border-2 border-green-300 bg-green-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    {uploadedFileName || "Purchase agreement uploaded"}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    File uploaded successfully
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 rounded-lg hover:bg-green-100 transition-colors touch-manipulation"
                aria-label="Remove file"
              >
                <X className="h-5 w-5 text-green-700" />
              </button>
            </div>
          )}

          <p className="mt-2 text-xs text-gray-600 flex items-start gap-1.5">
            <span className="text-primary-600 font-bold mt-0.5">→</span>
            <span>Upload a PDF copy (optional, max 10MB). If upload fails, you can email the agreement separately or include a link in the field above.</span>
          </p>
        </div>

        {/* Submission note */}
        <div className="mt-6 bg-gradient-to-br from-primary-50 via-primary-50/50 to-white p-6 rounded-xl border-2 border-primary-200 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl">✓</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">Almost There!</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You're almost done! Click "Next" below to review your submission before sending your deal to our network of qualified buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormStepContainer>
  );
}
