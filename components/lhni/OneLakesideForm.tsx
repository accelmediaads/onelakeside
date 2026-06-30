"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useUtmCapture, buildAttributionString, inferChannel } from "./useUtmCapture";

export interface OneLakesideFormData {
  name: string;
  email: string;
  phone: string;
  residence: string;
  priceRange: string;
  buyingAs: string;
  condoTimeline: string;
  bestTime: string;
  additionalDetails: string;
}

// Labels mirror the residence sections on the page. Keep these strings stable —
// they flow straight into the FUB note + email notification.
const residences = [
  "Residence 401 — 3 Bedroom",
  "Residence 402 — 2 Bedroom",
  "Residence 403 — 1 Bedroom (West / Lake View)",
  "Residence 408 — 1 Bedroom (Oversized Terrace)",
  "Residence 410 — 1 Bedroom (Accessible)",
  "Not sure yet — show me what's available",
];

// Maps a ?unit=NNN query param (set by the per-residence CTAs) to a dropdown value.
const unitParamMap: Record<string, string> = {
  "401": residences[0],
  "402": residences[1],
  "403": residences[2],
  "408": residences[3],
  "410": residences[4],
};

const priceRanges = [
  "Under $650,000",
  "$650,000 – $850,000",
  "$850,000 – $1,000,000",
  "$1,000,000+",
  "Show me everything",
];

const buyingAsOptions = [
  "Primary residence",
  "Second home / lake getaway",
  "Investment / rental",
  "Not sure yet",
];

const timelines = [
  "Ready to buy now",
  "Next 1–3 months",
  "3–6 months out",
  "Just exploring",
];

const bestTimes = ["Morning", "Afternoon", "Evening"];

export default function OneLakesideForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utm = useUtmCapture();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OneLakesideFormData>();

  // Pre-select the residence dropdown when arriving from a per-unit CTA
  // (e.g. /one-lakeside?unit=408#inquire).
  useEffect(() => {
    const unit = searchParams.get("unit");
    if (unit && unitParamMap[unit]) {
      setValue("residence", unitParamMap[unit]);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: OneLakesideFormData) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("access_key", "2e245ef1-dcaa-46a0-ba9f-f20bc81b0630");
      formData.append(
        "subject",
        `New One Lakeside Lead: ${data.name} — ${data.residence || "Residence TBD"}`
      );
      formData.append("from_name", "One Lakeside Leads");
      // CC Aaron on every submission (backup to the primary info@ delivery)
      formData.append("cc_email", "aaronbsocials@gmail.com");
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("Residence of Interest", data.residence || "Not specified");
      formData.append("Budget", data.priceRange || "Not specified");
      formData.append("Buying As", data.buyingAs || "Not specified");
      formData.append("Purchase Timeline", data.condoTimeline || "Not specified");
      formData.append("Best Time to Call", data.bestTime || "Not specified");
      formData.append("Additional Details", data.additionalDetails || "None");
      formData.append("Source", "One Lakeside LP");
      formData.append("Channel (inferred)", inferChannel(utm));
      formData.append("Attribution", buildAttributionString(utm));
      formData.append("botcheck", "");

      const [, fubRes] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        }),
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadType: "lakeside",
            name: data.name,
            email: data.email,
            phone: data.phone,
            residence: data.residence,
            priceRange: data.priceRange,
            buyingAs: data.buyingAs,
            condoTimeline: data.condoTimeline,
            bestTime: data.bestTime,
            additionalDetails: data.additionalDetails,
            attribution: utm,
          }),
        }),
      ]);

      const fubResult = fubRes.status === "fulfilled" ? fubRes.value : null;
      if (fubResult && !fubResult.ok) {
        const body = await fubResult.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      // Fire conversion events ONLY after a successful submit — same pattern as
      // the other LHNI forms so direct /thank-you visits never inflate counts.
      const w = window as unknown as {
        fbq?: (...args: unknown[]) => void;
        gtag?: (...args: unknown[]) => void;
      };
      if (typeof w.fbq === "function") {
        w.fbq("track", "Lead", {
          content_name: "One Lakeside Condo Lead",
          content_category: "Real Estate",
        });
      }
      if (typeof w.gtag === "function") {
        w.gtag("event", "lhni_lakeside_lead", {
          content_name: "One Lakeside Condo Lead",
          content_category: "Real Estate",
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      router.push("/thank-you?type=lakeside");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const inputClasses = "w-full ol-input rounded-lg px-4 py-3 text-sm";
  const labelClasses = "block text-sm font-medium mb-1.5 text-[#1f2a30]";
  const selectClasses =
    "w-full ol-input rounded-lg px-4 py-3 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238a97a0%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Full Name <span className="text-[#b08d4f]">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClasses}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-[#b08d4f]">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Phone & Best Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Phone <span className="text-[#b08d4f]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(208) 555-0100"
            className={inputClasses}
            {...register("phone", { required: "Phone is required" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="bestTime" className={labelClasses}>
            Best Time to Reach You
          </label>
          <select id="bestTime" className={selectClasses} {...register("bestTime")}>
            <option value="">Select a time</option>
            {bestTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr className="ol-divider my-2" />

      {/* Residence & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="residence" className={labelClasses}>
            Residence of Interest
          </label>
          <select id="residence" className={selectClasses} {...register("residence")}>
            <option value="">Select a residence</option>
            {residences.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priceRange" className={labelClasses}>
            Budget
          </label>
          <select id="priceRange" className={selectClasses} {...register("priceRange")}>
            <option value="">Select a range</option>
            {priceRanges.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buying as & Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="buyingAs" className={labelClasses}>
            Buying As
          </label>
          <select id="buyingAs" className={selectClasses} {...register("buyingAs")}>
            <option value="">Select one</option>
            {buyingAsOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="condoTimeline" className={labelClasses}>
            Purchase Timeline
          </label>
          <select id="condoTimeline" className={selectClasses} {...register("condoTimeline")}>
            <option value="">Select a timeframe</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Details */}
      <div>
        <label htmlFor="additionalDetails" className={labelClasses}>
          Anything Else We Should Know?{" "}
          <span className="text-[#8a97a0] font-normal">(optional)</span>
        </label>
        <textarea
          id="additionalDetails"
          rows={4}
          placeholder="Floor preference, lake-view priority, financing questions, timeline to tour..."
          className={`${inputClasses} resize-y`}
          {...register("additionalDetails")}
        />
      </div>

      {/* Error banner */}
      {status === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full ol-btn-gold px-6 py-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Request Pricing & a Private Tour"}
      </button>

      <p className="text-xs text-[#8a97a0] text-center">
        Your information is kept strictly confidential and will never be shared.
      </p>
    </form>
  );
}
