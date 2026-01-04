import { createFileRoute } from "@tanstack/react-router";
import { FAQSection } from "~/components/FAQSection";

export const Route = createFileRoute("/faqs/")({
  component: FAQs,
});

function FAQs() {
  return (
    <div className="bg-white">
      <FAQSection />
    </div>
  );
}
