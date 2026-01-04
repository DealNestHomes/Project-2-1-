import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Upload, X, CheckCircle, Loader2, FileText, Download } from "lucide-react";
import { useAuthStore } from "~/stores/useAuthStore";

interface DealDocumentUploadProps {
  dealId: number;
  jvAgreementKey?: string | null;
  purchaseAgreementKey?: string | null;
  assignmentAgreementKey?: string | null;
  minioBaseUrl: string;
}

export function DealDocumentUpload({
  dealId,
  jvAgreementKey,
  purchaseAgreementKey,
  assignmentAgreementKey,
  minioBaseUrl,
}: DealDocumentUploadProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const generatePresignedUrlMutation = useMutation(
    trpc.generatePresignedUploadUrl.mutationOptions()
  );

  const updateDocumentMutation = useMutation(
    trpc.updateDealDocument.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
      },
    })
  );

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: "jv" | "purchase" | "assignment"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      event.target.value = "";
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      event.target.value = "";
      return;
    }

    setUploadingDoc(documentType);

    try {
      // Get presigned URL from backend
      const { presignedUrl, objectKey } =
        await generatePresignedUrlMutation.mutateAsync({
          filename: file.name,
        });

      // Upload file to MinIO using presigned URL
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

      // Update the deal with the new document key
      await updateDocumentMutation.mutateAsync({
        authToken: token!,
        dealId,
        documentType,
        objectKey,
      });

      toast.success(
        `${getDocumentLabel(documentType)} uploaded successfully`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploadingDoc(null);
      event.target.value = "";
    }
  };

  const handleRemoveFile = async (
    documentType: "jv" | "purchase" | "assignment"
  ) => {
    try {
      await updateDocumentMutation.mutateAsync({
        authToken: token!,
        dealId,
        documentType,
        objectKey: null,
      });

      toast.success(`${getDocumentLabel(documentType)} removed`);
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file. Please try again.");
    }
  };

  const getDocumentLabel = (documentType: "jv" | "purchase" | "assignment") => {
    switch (documentType) {
      case "jv":
        return "JV Agreement";
      case "purchase":
        return "Purchase Agreement";
      case "assignment":
        return "Assignment Agreement";
    }
  };

  const getDocumentKey = (documentType: "jv" | "purchase" | "assignment") => {
    switch (documentType) {
      case "jv":
        return jvAgreementKey;
      case "purchase":
        return purchaseAgreementKey;
      case "assignment":
        return assignmentAgreementKey;
    }
  };

  const renderDocumentUpload = (
    documentType: "jv" | "purchase" | "assignment",
    colorScheme: "pink" | "purple" | "amber"
  ) => {
    const documentKey = getDocumentKey(documentType);
    const isUploading = uploadingDoc === documentType;
    const label = getDocumentLabel(documentType);

    const colors = {
      pink: {
        gradient: "from-pink-600 to-pink-700",
        border: "border-pink-200",
        bg: "bg-pink-50",
        text: "text-pink-700",
      },
      purple: {
        gradient: "from-purple-600 to-purple-700",
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-700",
      },
      amber: {
        gradient: "from-amber-600 to-amber-700",
        border: "border-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-700",
      },
    };

    const scheme = colors[colorScheme];

    return (
      <div className="bg-white rounded-xl border-2 border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
        <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${scheme.border}`}>
          <div className={`w-10 h-10 bg-gradient-to-br ${scheme.gradient} rounded-xl flex items-center justify-center shadow-md`}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{label}</h3>
        </div>

        {!documentKey ? (
          <div className="relative">
            <input
              id={`${documentType}-upload`}
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileSelect(e, documentType)}
              disabled={isUploading}
              className="hidden"
            />
            <label
              htmlFor={`${documentType}-upload`}
              className={`
                flex items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed
                ${
                  isUploading
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-primary-300 bg-primary-50/30 hover:bg-primary-50 hover:border-primary-400 cursor-pointer"
                }
                transition-all px-4 py-6 text-sm md:text-base min-h-[80px]
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 text-primary-600 animate-spin flex-shrink-0" />
                  <span className="text-primary-700 font-semibold">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-primary-700 font-semibold text-center">
                    Click to upload PDF (max 10MB)
                  </span>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between w-full rounded-xl border-2 border-green-300 bg-green-50 px-3 py-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-green-900">
                    Document uploaded
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    File is available for download
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(documentType)}
                disabled={updateDocumentMutation.isPending}
                className="p-2 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
                aria-label="Remove file"
              >
                <X className="h-5 w-5 text-green-700" />
              </button>
            </div>
            <a
              href={`${minioBaseUrl}/purchase-agreements/${documentKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors bg-primary-50 px-4 py-2.5 rounded-lg hover:bg-primary-100 shadow-sm hover:shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download {label}</span>
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '150ms' }}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-200">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2.5 md:p-3 rounded-xl shadow-md">
          <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Deal Documents</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {renderDocumentUpload("jv", "pink")}
        {renderDocumentUpload("purchase", "purple")}
        {renderDocumentUpload("assignment", "amber")}
      </div>

      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800 font-medium leading-relaxed">
          Upload PDF documents for this deal. These will be included when sending deal information to the transaction coordinator.
        </p>
      </div>
    </div>
  );
}
