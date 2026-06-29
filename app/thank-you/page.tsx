import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/scroll/FadeIn";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thank you for reaching out to Luxury Homes North Idaho. Greg Rowley will be in touch shortly.",
};

interface ThankYouPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function LHNIThankYouPage({
  searchParams,
}: ThankYouPageProps) {
  const params = await searchParams;
  const isBuyer = params.type === "buyer";
  const isCondo = params.type === "condo";
  const isLakeside = params.type === "lakeside";

  // NOTE: Meta Pixel `Lead` and GA4 `lhni_buyer_lead`/`lhni_seller_lead`
  // events are fired by the form components on successful submit (see
  // components/lhni/BuyerForm.tsx and SellerForm.tsx). They intentionally
  // do NOT fire here on the thank-you page — that would also count
  // direct URL visits (testing, bookmarks, shared links) as Leads.

  const headlineCopy = isLakeside
    ? "Your One Lakeside inquiry has been received. Greg's team will reach out shortly with current pricing, availability, and a private tour time at the only residential tower on the water in downtown Coeur d'Alene."
    : isCondo
      ? "Your garage condo inquiry has been received. Greg's team will reach out shortly with current availability, pricing, and tour times at Locked & Loaded."
      : isBuyer
        ? "Greg will reach out shortly to learn more about what you're looking for and prepare a curated list of properties — including off-market opportunities."
        : "Your valuation request has been received. Greg and his team will review your property details and reach out to you shortly.";

  return (
    <>
      <section className="min-h-[80vh] flex items-center justify-center py-20 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="w-20 h-20 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-[#c9a96e]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Thank You
            </h1>

            <p className="text-[#b0b0b0] text-lg leading-relaxed mb-4">
              {headlineCopy}
            </p>

            <p className="text-[#8a8a8a] text-sm mb-10">
              You&apos;ll also receive a confirmation email with next steps.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-[#111] border border-[#222] rounded-xl p-8 inline-block">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#c9a96e]/30 shrink-0">
                  <Image
                    src="/team/greg-headshot-close.jpg"
                    alt="Greg Rowley"
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold text-lg">Greg Rowley</h2>
                  <p className="text-[#c9a96e] text-sm font-medium mb-2">
                    Luxury Property Specialist
                  </p>
                  <div className="space-y-1 text-sm text-[#8a8a8a]">
                    <a
                      href="tel:2086596527"
                      className="block hover:text-[#c9a96e] transition-colors"
                    >
                      208-659-6527
                    </a>
                    <a
                      href="mailto:growley@cbidaho.com"
                      className="block hover:text-[#c9a96e] transition-colors"
                    >
                      growley@cbidaho.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="mt-10 text-[#666] text-sm">
              Can&apos;t wait?{" "}
              <a
                href="tel:2086596527"
                className="text-[#c9a96e] hover:text-[#dfc291] transition-colors font-medium"
              >
                Call Greg directly
              </a>
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
