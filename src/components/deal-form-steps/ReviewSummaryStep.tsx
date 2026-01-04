import { UseFormWatch } from "react-hook-form";
import { ClipboardCheck, User, MapPin, Home, Calendar, Wrench, DollarSign, Users, FileText, Download } from "lucide-react";
import { FormStepContainer } from "~/components/FormStepContainer";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface ReviewSummaryStepProps {
  watch: UseFormWatch<any>;
}

const formatCurrency = (value: string | undefined) => {
  if (!value) return "Not provided";
  if (value === "Unknown") return "Unknown";
  // Remove any non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, "");
  const number = parseFloat(numericValue);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Not provided";
  if (dateString === "Unknown") return "Unknown";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateString;
  }
};

const displayValue = (value: any) => {
  if (value === "Unknown") {
    return <span className="text-gray-700 font-medium">Unknown</span>;
  }
  if (value === undefined || value === null || value === "") {
    return <span className="text-gray-400 italic">Not provided</span>;
  }
  return <span className="text-gray-900 font-medium">{value}</span>;
};

// Component for rendering individual field items with enhanced styling
function FieldItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label}
      </dt>
      <dd className="text-base leading-relaxed">{children}</dd>
    </div>
  );
}

// Component for rendering prominent financial fields
function FinancialFieldItem({ label, value, colorScheme = "default" }: { label: string; value: string; colorScheme?: "default" | "primary" | "accent" }) {
  const bgClass = colorScheme === "primary" 
    ? "bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-300"
    : colorScheme === "accent"
    ? "bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-300"
    : "bg-gradient-to-br from-gray-50 to-gray-100/50 border-gray-300";
  
  const textClass = colorScheme === "primary"
    ? "text-primary-700"
    : colorScheme === "accent"
    ? "text-accent-700"
    : "text-gray-700";

  return (
    <div className={`${bgClass} rounded-xl p-5 border-2 hover:shadow-lg transition-all`}>
      <dt className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
        {label}
      </dt>
      <dd className={`text-2xl font-bold ${textClass} leading-tight`}>
        {value}
      </dd>
    </div>
  );
}

export function ReviewSummaryStep({ watch }: ReviewSummaryStepProps) {
  const formData = watch();
  
  const trpc = useTRPC();
  const minioBaseUrlQuery = useQuery(trpc.getMinioBaseUrl.queryOptions());
  const minioBaseUrl = minioBaseUrlQuery.data?.baseUrl;

  return (
    <FormStepContainer
      title="Review Your Submission"
      description="Please review all the information below before submitting your deal. You can go back to any step to make changes."
      icon={<ClipboardCheck className="h-6 w-6 text-white" />}
      colorScheme="accent"
    >
      <div className="space-y-8">
        {/* Contact Information Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-primary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Your Contact Information</h3>
          </div>
          <dl className="grid md:grid-cols-2 gap-4">
            <FieldItem label="Name">
              {displayValue(formData.name)}
            </FieldItem>
            <FieldItem label="Email">
              {displayValue(formData.email)}
            </FieldItem>
            <FieldItem label="Phone">
              {displayValue(formData.phone)}
            </FieldItem>
          </dl>
        </div>

        {/* Property Location Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-accent-200">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Property Location</h3>
          </div>
          <dl className="grid md:grid-cols-2 gap-4">
            <FieldItem label="Address">
              {displayValue(formData.propertyAddress)}
            </FieldItem>
            <FieldItem label="ZIP Code">
              {displayValue(formData.zipCode)}
            </FieldItem>
            <FieldItem label="Property Type">
              {displayValue(formData.propertyType)}
            </FieldItem>
          </dl>
        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-primary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <Home className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Property Details</h3>
          </div>
          <dl className="grid md:grid-cols-3 gap-4">
            <FieldItem label="Bedrooms">
              {displayValue(formData.bedrooms)}
            </FieldItem>
            <FieldItem label="Full Bathrooms">
              {displayValue(formData.baths)}
            </FieldItem>
            <FieldItem label="Half Bathrooms">
              {displayValue(formData.halfBaths)}
            </FieldItem>
            <FieldItem label="Square Footage">
              {formData.squareFootage && formData.squareFootage !== "Unknown" ? (
                <span className="text-gray-900 font-semibold text-lg">
                  {typeof formData.squareFootage === 'number' 
                    ? formData.squareFootage.toLocaleString() 
                    : formData.squareFootage}
                  <span className="text-sm text-gray-600 font-normal ml-1">sq ft</span>
                </span>
              ) : formData.squareFootage === "Unknown" ? (
                <span className="text-gray-700 font-medium">Unknown</span>
              ) : (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </FieldItem>
            <FieldItem label="Year Built">
              {displayValue(formData.yearBuilt)}
            </FieldItem>
            <FieldItem label="Parking Type">
              {displayValue(formData.parkingType)}
            </FieldItem>
            <FieldItem label="Lot Size">
              {formData.lotSize && formData.lotSize !== "Unknown" ? (
                <span className="text-gray-900 font-medium">
                  {formData.lotSize} <span className="text-gray-600">{formData.lotSizeUnit || ""}</span>
                </span>
              ) : formData.lotSize === "Unknown" ? (
                <span className="text-gray-700 font-medium">Unknown</span>
              ) : (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </FieldItem>
          </dl>
        </div>

        {/* Deal Timeline Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-accent-200">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Deal Timeline</h3>
          </div>
          <dl className="grid md:grid-cols-3 gap-4">
            <FieldItem label="Closing Date">
              <span className="text-gray-900 font-semibold">{formatDate(formData.closingDate)}</span>
            </FieldItem>
            <FieldItem label="Inspection Period Expiration">
              <span className="text-gray-900 font-semibold">{formatDate(formData.inspectionPeriodExpiration)}</span>
            </FieldItem>
            <FieldItem label="Occupancy Status">
              {displayValue(formData.occupancy)}
            </FieldItem>
          </dl>
        </div>

        {/* Property Condition Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-primary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Property Condition & Systems</h3>
          </div>
          <dl className="grid md:grid-cols-3 gap-4">
            <FieldItem label="Property Condition">
              {displayValue(formData.propertyCondition)}
            </FieldItem>
            <FieldItem label="Repair Estimate Range">
              {formData.repairEstimateMin || formData.repairEstimateMax ? (
                <span className="text-gray-900 font-semibold">
                  {formatCurrency(formData.repairEstimateMin)} - {formatCurrency(formData.repairEstimateMax)}
                </span>
              ) : (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </FieldItem>
            <FieldItem label="Roof Age">
              {displayValue(formData.roofAge)}
            </FieldItem>
            <FieldItem label="AC Type">
              {displayValue(formData.acType)}
            </FieldItem>
            <FieldItem label="Heating System Type">
              {displayValue(formData.heatingSystemType)}
            </FieldItem>
            <FieldItem label="Heating System Age">
              {displayValue(formData.heatingSystemAge)}
            </FieldItem>
            <FieldItem label="Foundation Type">
              {displayValue(formData.foundationType)}
            </FieldItem>
            <FieldItem label="Foundation Condition">
              {displayValue(formData.foundationCondition)}
            </FieldItem>
          </dl>
        </div>

        {/* Financial Details Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-accent-200">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Financial Details</h3>
          </div>
          <dl className="grid md:grid-cols-3 gap-4">
            <FinancialFieldItem 
              label="ARV (After Repair Value)" 
              value={formatCurrency(formData.arv)}
              colorScheme="primary"
            />
            <FinancialFieldItem 
              label="Estimated Repairs" 
              value={formatCurrency(formData.estimatedRepairs)}
              colorScheme="accent"
            />
            <FinancialFieldItem 
              label="Contract Price" 
              value={formatCurrency(formData.contractPrice)}
              colorScheme="primary"
            />
          </dl>
        </div>

        {/* Seller Information Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-primary-200">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Seller Information</h3>
          </div>
          <dl className="grid md:grid-cols-2 gap-4">
            <FieldItem label="Seller Name">
              {displayValue(formData.sellerName)}
            </FieldItem>
            <FieldItem label="Seller Email">
              {displayValue(formData.sellerEmail)}
            </FieldItem>
            <FieldItem label="Seller Phone">
              {displayValue(formData.sellerPhone)}
            </FieldItem>
          </dl>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-accent-200">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Additional Information</h3>
          </div>
          <dl className="space-y-4">
            <FieldItem label="Additional Notes">
              <p className="whitespace-pre-wrap leading-relaxed">
                {displayValue(formData.additionalInfo)}
              </p>
            </FieldItem>
            <FieldItem label="Property Access Instructions">
              <p className="whitespace-pre-wrap leading-relaxed">
                {displayValue(formData.propertyAccess)}
              </p>
            </FieldItem>
            <FieldItem label="Photo Link">
              {formData.photoLink && formData.photoLink !== "Unknown" ? (
                <a
                  href={formData.photoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:text-accent-700 underline font-semibold break-all"
                >
                  {formData.photoLink}
                </a>
              ) : formData.photoLink === "Unknown" ? (
                <span className="text-gray-700 font-medium">Unknown</span>
              ) : (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </FieldItem>
            <FieldItem label="Purchase Agreement">
              {formData.purchaseAgreementKey && minioBaseUrl ? (
                <a
                  href={`${minioBaseUrl}/purchase-agreements/${formData.purchaseAgreementKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>View Purchase Agreement (PDF)</span>
                </a>
              ) : (
                <span className="text-gray-400 italic">Not provided</span>
              )}
            </FieldItem>
          </dl>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-accent-50 via-accent-50/50 to-white p-6 rounded-xl border-2 border-accent-200 shadow-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center shadow-md">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">Ready to Submit?</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Please review all the information above. If you need to make any changes, use the "Back" button to navigate to the appropriate step. When everything looks correct, click "Submit Deal" to send your deal to our network of qualified buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FormStepContainer>
  );
}
