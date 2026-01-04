import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useAuthStore } from "~/stores/useAuthStore";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Wrench,
  MessageSquare,
  CheckCircle,
  CheckCircle2,
  User,
  Edit2,
  Save,
  X,
  Send,
} from "lucide-react";
import { PhoneInput } from "~/components/PhoneInput";
import { DealDocumentUpload } from "~/components/DealDocumentUpload";
import { ContactInfoEditForm } from "~/components/deal-edit-sections/ContactInfoEditForm";
import { SellerInfoEditForm } from "~/components/deal-edit-sections/SellerInfoEditForm";
import { PropertyInfoEditForm } from "~/components/deal-edit-sections/PropertyInfoEditForm";
import { DealDetailsEditForm } from "~/components/deal-edit-sections/DealDetailsEditForm";
import { RepairSystemsEditForm } from "~/components/deal-edit-sections/RepairSystemsEditForm";
import { AdditionalInfoEditForm } from "~/components/deal-edit-sections/AdditionalInfoEditForm";

export const Route = createFileRoute("/staff/$dealId/")({
  component: DealDetailPage,
});

function DealDetailPage() {
  const { dealId } = Route.useParams();
  const navigate = useNavigate();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isEditingDealDetails, setIsEditingDealDetails] = useState(false);
  const [isEditingRepairSystems, setIsEditingRepairSystems] = useState(false);
  const [isEditingAdditionalInfo, setIsEditingAdditionalInfo] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [isTcModalOpen, setIsTcModalOpen] = useState(false);
  const [tcEmailInput, setTcEmailInput] = useState("contract2closings@gmail.com");

  const dealQuery = useQuery(
    trpc.getDealSubmission.queryOptions({
      authToken: token!,
      dealId: parseInt(dealId),
    }),
  );

  const minioBaseUrlQuery = useQuery(trpc.getMinioBaseUrl.queryOptions());
  const minioBaseUrl = minioBaseUrlQuery.data?.baseUrl;

  const updateMutation = useMutation(
    trpc.updateDealDetails.mutationOptions({
      onSuccess: () => {
        toast.success("Deal updated successfully!");
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.listDealSubmissions.queryKey(),
        });
        reset();
        setIsEditingAssignment(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update deal");
      },
    }),
  );

  const sendToTcMutation = useMutation(
    trpc.sendDealToTc.mutationOptions({
      onSuccess: () => {
        toast.success("Deal information sent to TC successfully!");
        setIsTcModalOpen(false);
        queryClient.invalidateQueries({
          queryKey: trpc.getDealSubmission.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to send deal to TC");
      },
    }),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ status: string; staffNotes: string }>();

  const {
    register: registerAssignment,
    handleSubmit: handleSubmitAssignment,
    reset: resetAssignment,
    control: controlAssignment,
    formState: { errors: errorsAssignment },
  } = useForm<{
    assignmentProfit: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
  }>();

  const onSubmit = (data: { status: string; staffNotes: string }) => {
    updateMutation.mutate({
      authToken: token!,
      dealId: parseInt(dealId),
      status: data.status,
      staffNotes: data.staffNotes || undefined,
    });
  };

  const onSubmitAssignment = (data: {
    assignmentProfit: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
  }) => {
    updateMutation.mutate({
      authToken: token!,
      dealId: parseInt(dealId),
      assignmentProfit: data.assignmentProfit || undefined,
      buyerName: data.buyerName || undefined,
      buyerPhone: data.buyerPhone || undefined,
      buyerEmail: data.buyerEmail || undefined,
    });
    setIsEditingAssignment(false);
  };

  const handleSendToTc = () => {
    sendToTcMutation.mutate({
      authToken: token!,
      dealId: parseInt(dealId),
      tcEmailOverride: tcEmailInput !== "contract2closings@gmail.com" ? tcEmailInput : undefined,
    });
  };

  if (dealQuery.isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-100 animate-in fade-in duration-300">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
        <p className="text-lg text-gray-600 font-medium">Loading deal details...</p>
      </div>
    );
  }

  if (dealQuery.error || !dealQuery.data) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-8 text-center shadow-lg animate-in fade-in duration-300">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-red-800 text-lg font-semibold mb-4">
          Error loading deal: {dealQuery.error?.message || "Deal not found"}
        </p>
        <button
          onClick={() => navigate({ to: "/staff" })}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const deal = dealQuery.data;

  const displayValue = (value: any) => {
    if (value === "Unknown") {
      return <span className="text-gray-700">Unknown</span>;
    }
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400 italic">Not provided</span>;
    }
    return value;
  };

  // Helper function to format UTC dates for display
  // Dates are stored as UTC midnight, so we use UTC methods to prevent timezone shifts
  const formatUTCDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-2 border-blue-200",
      under_review: "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-2 border-purple-200",
      posted: "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 border-2 border-indigo-200",
      offer_accepted: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-2 border-amber-200",
      closed: "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-2 border-green-200",
      dead: "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 border-2 border-gray-400",
    };
    return colors[status] || "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-2 border-gray-200";
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50/50 to-white rounded-xl p-5 md:p-6 shadow-md border-2 border-primary-100 animate-in fade-in slide-in-from-top-4 duration-300">
        <button
          onClick={() => navigate({ to: "/staff" })}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 md:mb-6 transition-all group bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-primary-200 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 truncate">{deal.name}</h1>
            <p className="text-gray-600 text-sm md:text-base">Deal #{deal.id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {deal.sentToTcAt && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 px-3 md:px-4 py-2 md:py-2.5 rounded-xl shadow-sm">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Sent to TC</span>
                  <span className="text-xs text-green-700 font-medium">
                    {new Date(deal.sentToTcAt).toLocaleDateString()} at {new Date(deal.sentToTcAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setTcEmailInput("contract2closings@gmail.com");
                setIsTcModalOpen(true);
              }}
              disabled={sendToTcMutation.isPending}
              className="group relative bg-gradient-to-r from-accent-600 to-accent-700 text-white px-4 md:px-5 py-2 md:py-3 rounded-xl font-bold hover:from-accent-700 hover:to-accent-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden flex items-center gap-2 min-h-[44px] whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-2">
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{deal.sentToTcAt ? 'Resend to TC' : 'Send to TC'}</span>
                <span className="sm:hidden">TC</span>
              </span>
            </button>
            <span
              className={`px-3 md:px-6 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold shadow-sm whitespace-nowrap ${getStatusColor(deal.status)}`}
            >
              {deal.status === 'offer_accepted' ? 'ASSIGNED' : deal.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-primary-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Submitter Contact Information
                </h2>
              </div>
              {!isEditingContact && (
                <button
                  onClick={() => setIsEditingContact(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all border-2 border-primary-200 hover:border-primary-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingContact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{deal.name}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-gray-900 mt-2 text-base break-all">
                    <a
                      href={`mailto:${deal.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                    >
                      {deal.email}
                    </a>
                  </p>
                </div>
                {deal.phone && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Phone
                    </label>
                    <p className="text-gray-900 mt-2 text-base">
                      <a
                        href={`tel:${deal.phone}`}
                        className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                      >
                        {deal.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Submitted
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {new Date(deal.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <ContactInfoEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  name: deal.name,
                  email: deal.email,
                  phone: deal.phone,
                }}
                onCancel={() => setIsEditingContact(false)}
                onSuccess={() => setIsEditingContact(false)}
              />
            )}
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '50ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-accent-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Seller Information
                </h2>
              </div>
              {!isEditingSeller && (
                <button
                  onClick={() => setIsEditingSeller(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 transition-all border-2 border-accent-200 hover:border-accent-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingSeller ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Seller Name
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{deal.sellerName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Seller Email
                  </label>
                  <p className="text-gray-900 mt-2 text-base break-all">
                    <a
                      href={`mailto:${deal.sellerEmail}`}
                      className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                    >
                      {deal.sellerEmail}
                    </a>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Seller Phone
                  </label>
                  <p className="text-gray-900 mt-2 text-base">
                    <a
                      href={`tel:${deal.sellerPhone}`}
                      className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                    >
                      {deal.sellerPhone}
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <SellerInfoEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  sellerName: deal.sellerName,
                  sellerEmail: deal.sellerEmail,
                  sellerPhone: deal.sellerPhone,
                }}
                onCancel={() => setIsEditingSeller(false)}
                onSuccess={() => setIsEditingSeller(false)}
              />
            )}
          </div>

          {/* Assignment Details */}
          {(deal.status === 'offer_accepted' || deal.status === 'closed' || deal.buyerName || deal.buyerPhone || deal.buyerEmail) && (
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-2.5 md:p-3 rounded-xl shadow-md">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Assignment Details
                  </h2>
                </div>
                {!isEditingAssignment ? (
                  <button
                    onClick={() => {
                      resetAssignment({
                        assignmentProfit: deal.assignmentProfit || "",
                        buyerName: deal.buyerName || "",
                        buyerPhone: deal.buyerPhone || "",
                        buyerEmail: deal.buyerEmail || "",
                      });
                      setIsEditingAssignment(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-all border-2 border-green-200 hover:border-green-300 min-h-[44px] whitespace-nowrap"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingAssignment(false);
                      resetAssignment();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 min-h-[44px] whitespace-nowrap"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {!isEditingAssignment ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Assignment Profit
                    </label>
                    <p className="text-gray-900 mt-2 text-base font-medium">
                      {deal.assignmentProfit ? (
                        `$${parseInt(deal.assignmentProfit.replace(/,/g, '')).toLocaleString()}`
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Buyer Name
                    </label>
                    <p className="text-gray-900 mt-2 text-base font-medium">
                      {deal.buyerName || <span className="text-gray-400 italic">Not provided</span>}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Buyer Email
                    </label>
                    <p className="text-gray-900 mt-2 text-base break-all">
                      {deal.buyerEmail ? (
                        <a
                          href={`mailto:${deal.buyerEmail}`}
                          className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                        >
                          {deal.buyerEmail}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Buyer Phone
                    </label>
                    <p className="text-gray-900 mt-2 text-base">
                      {deal.buyerPhone ? (
                        <a
                          href={`tel:${deal.buyerPhone}`}
                          className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                        >
                          {deal.buyerPhone}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitAssignment(onSubmitAssignment)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
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
                          {...registerAssignment("assignmentProfit", {
                            pattern: {
                              value: /^[\d,\.]+$/,
                              message: "Assignment profit must contain only numbers",
                            },
                          })}
                          placeholder="10,000"
                          className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 pl-9 text-base min-h-[52px] placeholder:text-gray-400 font-semibold"
                        />
                      </div>
                      {errorsAssignment.assignmentProfit && (
                        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {errorsAssignment.assignmentProfit.message}
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
                        {...registerAssignment("buyerName")}
                        placeholder="John Smith"
                        className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
                      />
                      {errorsAssignment.buyerName && (
                        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {errorsAssignment.buyerName.message}
                        </p>
                      )}
                    </div>

                    {/* Buyer Email */}
                    <div className="sm:col-span-2">
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
                        {...registerAssignment("buyerEmail")}
                        placeholder="buyer@example.com"
                        className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
                      />
                      {errorsAssignment.buyerEmail && (
                        <p className="mt-2.5 text-sm text-red-600 flex items-center gap-1.5 font-medium">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full" />
                          {errorsAssignment.buyerEmail.message}
                        </p>
                      )}
                    </div>

                    {/* Buyer Phone */}
                    <div className="sm:col-span-2">
                      <PhoneInput
                        name="buyerPhone"
                        control={controlAssignment}
                        label="Buyer Phone Number"
                        required={false}
                        error={errorsAssignment.buyerPhone}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t-2 border-gray-100">
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
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
              )}
            </div>
          )}

          {/* Deal Documents */}
          {minioBaseUrl && (
            <DealDocumentUpload
              dealId={parseInt(dealId)}
              jvAgreementKey={deal.jvAgreementKey}
              purchaseAgreementKey={deal.purchaseAgreementKey}
              assignmentAgreementKey={deal.assignmentAgreementKey}
              minioBaseUrl={minioBaseUrl}
            />
          )}

          {/* Property Information */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '150ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-primary-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <Home className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Property Information
                </h2>
              </div>
              {!isEditingProperty && (
                <button
                  onClick={() => setIsEditingProperty(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all border-2 border-primary-200 hover:border-primary-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingProperty ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Address
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.propertyAddress}
                    <br />
                    {deal.zipCode}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Property Type
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.propertyType)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Bedrooms
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.bedrooms)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Bathrooms
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.baths !== null && deal.baths !== undefined ? (
                      <>
                        {deal.baths}
                        {deal.halfBaths ? ` + ${deal.halfBaths} half` : ""}
                      </>
                    ) : (
                      displayValue(deal.baths)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Square Footage
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.squareFootage !== null && deal.squareFootage !== undefined && deal.squareFootage !== "Unknown" ? (
                      `${deal.squareFootage.toLocaleString()} sq ft`
                    ) : (
                      displayValue(deal.squareFootage)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Lot Size
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.lotSize !== null && deal.lotSize !== undefined && deal.lotSize !== "Unknown" ? (
                      `${deal.lotSize} ${deal.lotSizeUnit || ""}`
                    ) : (
                      displayValue(deal.lotSize)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Year Built
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.yearBuilt)}</p>
                </div>
              </div>
            ) : (
              <PropertyInfoEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  propertyAddress: deal.propertyAddress,
                  zipCode: deal.zipCode,
                  propertyType: deal.propertyType,
                  bedrooms: deal.bedrooms,
                  baths: deal.baths,
                  halfBaths: deal.halfBaths,
                  squareFootage: deal.squareFootage,
                  lotSize: deal.lotSize,
                  lotSizeUnit: deal.lotSizeUnit,
                  yearBuilt: deal.yearBuilt,
                }}
                onCancel={() => setIsEditingProperty(false)}
                onSuccess={() => setIsEditingProperty(false)}
              />
            )}
          </div>

          {/* Deal Details */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Deal Details
                </h2>
              </div>
              {!isEditingDealDetails && (
                <button
                  onClick={() => setIsEditingDealDetails(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-all border-2 border-green-200 hover:border-green-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingDealDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border-2 border-green-200 shadow-sm">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    ARV (After Repair Value)
                  </label>
                  <p className="text-2xl md:text-3xl font-bold text-green-700 mt-2">
                    ${deal.arv.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border-2 border-red-200 shadow-sm">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Estimated Repairs
                  </label>
                  <p className="text-2xl md:text-3xl font-bold text-red-700 mt-2">
                    ${deal.estimatedRepairs.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border-2 border-primary-200 shadow-sm sm:col-span-2 lg:col-span-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Contract Price
                  </label>
                  <p className="text-2xl md:text-3xl font-bold text-primary-700 mt-2">
                    ${deal.contractPrice.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Closing Date
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.closingDate ? (
                      formatUTCDate(deal.closingDate)
                    ) : (
                      displayValue(deal.closingDate)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Inspection Period Expiration
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.inspectionPeriodExpiration ? (
                      formatUTCDate(deal.inspectionPeriodExpiration)
                    ) : (
                      displayValue(deal.inspectionPeriodExpiration)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Occupancy
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.occupancy)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Property Condition
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.propertyCondition)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Property Access
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.propertyAccess)}</p>
                </div>
              </div>
            ) : (
              <DealDetailsEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  closingDate: deal.closingDate,
                  inspectionPeriodExpiration: deal.inspectionPeriodExpiration,
                  occupancy: deal.occupancy,
                  propertyCondition: deal.propertyCondition,
                  propertyAccess: deal.propertyAccess,
                  contractPrice: deal.contractPrice,
                  arv: deal.arv,
                  estimatedRepairs: deal.estimatedRepairs,
                }}
                onCancel={() => setIsEditingDealDetails(false)}
                onSuccess={() => setIsEditingDealDetails(false)}
              />
            )}
          </div>

          {/* Repair & Systems */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '250ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-accent-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <Wrench className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Repair & System Details
                </h2>
              </div>
              {!isEditingRepairSystems && (
                <button
                  onClick={() => setIsEditingRepairSystems(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 transition-all border-2 border-accent-200 hover:border-accent-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingRepairSystems ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Repair Estimate
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.repairEstimateMin && deal.repairEstimateMax ? (
                      `$${deal.repairEstimateMin.toLocaleString()} - $${deal.repairEstimateMax.toLocaleString()}`
                    ) : (
                      displayValue(deal.repairEstimateMin || deal.repairEstimateMax)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Roof Age
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.roofAge)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    AC Type
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.acType)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Heating System Type
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.heatingSystemType)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Heating System Age
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.heatingSystemAge)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Foundation
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">
                    {deal.foundationType ? (
                      <>
                        {deal.foundationType}
                        {deal.foundationCondition &&
                          deal.foundationCondition !== "Unknown" &&
                          ` - ${deal.foundationCondition}`}
                      </>
                    ) : (
                      displayValue(deal.foundationType)
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Parking
                  </label>
                  <p className="text-gray-900 mt-2 text-base font-medium">{displayValue(deal.parkingType)}</p>
                </div>
              </div>
            ) : (
              <RepairSystemsEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  repairEstimateMin: deal.repairEstimateMin,
                  repairEstimateMax: deal.repairEstimateMax,
                  roofAge: deal.roofAge,
                  acType: deal.acType,
                  heatingSystemType: deal.heatingSystemType,
                  heatingSystemAge: deal.heatingSystemAge,
                  foundationType: deal.foundationType,
                  foundationCondition: deal.foundationCondition,
                  parkingType: deal.parkingType,
                }}
                onCancel={() => setIsEditingRepairSystems(false)}
                onSuccess={() => setIsEditingRepairSystems(false)}
              />
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '300ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b-2 border-primary-200">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Additional Information
                </h2>
              </div>
              {!isEditingAdditionalInfo && (
                <button
                  onClick={() => setIsEditingAdditionalInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-all border-2 border-primary-200 hover:border-primary-300 min-h-[44px] whitespace-nowrap"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {!isEditingAdditionalInfo ? (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Notes
                  </label>
                  <p className="text-gray-900 mt-2 text-base leading-relaxed whitespace-pre-wrap">
                    {displayValue(deal.additionalInfo)}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Photos
                  </label>
                  <p className="mt-2">
                    {deal.photoLink && deal.photoLink !== "Unknown" ? (
                      <a
                        href={deal.photoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors bg-primary-50 px-4 py-2 rounded-lg"
                      >
                        View Photos
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      displayValue(deal.photoLink)
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <AdditionalInfoEditForm
                dealId={parseInt(dealId)}
                initialData={{
                  additionalInfo: deal.additionalInfo,
                  photoLink: deal.photoLink,
                }}
                onCancel={() => setIsEditingAdditionalInfo(false)}
                onSuccess={() => setIsEditingAdditionalInfo(false)}
              />
            )}
          </div>

          {/* Staff Notes History */}
          {deal.staffNotes && (
            <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '350ms' }}>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-accent-200">
                <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-2.5 md:p-3 rounded-xl shadow-md">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Staff Notes History
                </h2>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-900 whitespace-pre-wrap text-base leading-relaxed">
                  {deal.staffNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Update Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-5 md:p-6 lg:sticky lg:top-24 hover:shadow-lg transition-shadow duration-300 animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary-200">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2.5 md:p-3 rounded-xl shadow-md">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Update Deal
              </h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status", { required: "Status is required" })}
                  defaultValue={deal.status}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 font-medium focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 hover:border-primary-300 transition-all shadow-sm min-h-[52px] bg-white text-black"
                >
                  <option value="new">New Deals</option>
                  <option value="under_review">Under Review</option>
                  <option value="posted">Posted</option>
                  <option value="offer_accepted">Assigned</option>
                  <option value="closed">Sold</option>
                  <option value="dead">Dead Deals</option>
                </select>
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="staffNotes"
                  className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
                >
                  Add Note (Optional)
                </label>
                <textarea
                  id="staffNotes"
                  {...register("staffNotes")}
                  rows={5}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 hover:border-primary-300 transition-all shadow-sm resize-none text-black"
                  placeholder="Add communication notes or updates..."
                />
                <p className="mt-2 text-xs text-gray-500 italic">
                  Notes will be timestamped and added to the history
                </p>
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="group relative w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden min-h-[48px]"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Button content */}
                <span className="relative flex items-center justify-center gap-2">
                  {updateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Update Deal</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* TC Email Modal */}
      {isTcModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-primary-200">
              <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-2.5 md:p-3 rounded-xl shadow-md">
                <Send className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Send to Transaction Coordinator
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="tcEmail" className="block text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent-600" />
                  TC Email Address
                </label>
                <input
                  id="tcEmail"
                  type="email"
                  value={tcEmailInput}
                  onChange={(e) => setTcEmailInput(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-accent-500 focus:ring-4 focus:ring-accent-100 text-black transition-all hover:border-gray-300 hover:shadow-md px-4 py-3 text-base min-h-[52px]"
                  placeholder="contract2closings@gmail.com"
                />
                <p className="mt-2 text-xs text-gray-500 italic">
                  Default: contract2closings@gmail.com
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                  This will send the complete deal information to the transaction coordinator and record the timestamp.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setIsTcModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendToTc}
                  disabled={sendToTcMutation.isPending || !tcEmailInput}
                  className="flex-1 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-4 py-3 rounded-xl font-bold hover:from-accent-700 hover:to-accent-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {sendToTcMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
