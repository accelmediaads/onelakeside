import { NextResponse } from "next/server";

const FUB_API_KEY = process.env.FUB_API_KEY;

type LeadType = "seller" | "buyer" | "condo" | "lakeside";

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  landing_page?: string;
  referrer?: string;
}

interface LeadPayload {
  leadType: LeadType;
  name: string;
  email: string;
  phone: string;
  bestTime?: string;
  additionalDetails?: string;
  // Seller-only
  propertyAddress?: string;
  propertyType?: string;
  estimatedValue?: string;
  timeline?: string;
  reasonForSelling?: string;
  // Buyer-only
  areasOfInterest?: string[];
  priceRange?: string;
  buyerTimeline?: string;
  currentlyOwn?: string;
  // Garage condo-only (Locked & Loaded LP)
  unitSize?: string;
  intendedUse?: string;
  condoTimeline?: string;
  // One Lakeside-only (residential lakeside condo LP)
  residence?: string; // which unit they're interested in (401 / 402 / 403 / 408 / 410 / unsure)
  buyingAs?: string; // primary residence / second home / investment
  // Attribution (UTMs + click IDs from the URL at form submit time)
  attribution?: Attribution;
}

// Max accepted length per field. Required fields are rejected when over-cap;
// optional / free-text fields and attribution values are truncated (see `str()`
// and the attribution loop below). Prevents a client from POSTing a multi-MB
// payload that lands verbatim in a FUB note. Per SECURITY-CLAUDE.md (validate
// server-side, don't trust the browser).
const MAX = {
  name: 120,
  email: 254, // RFC 5321 max
  phone: 32,
  shortField: 200, // selects / single-line answers
  longText: 2000, // free-text (additional details, reason for selling)
  attrValue: 500,
  arrayItems: 30,
} as const;

function validate(
  body: unknown
): { valid: true; data: LeadPayload } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required." };
  }

  const b = body as Record<string, unknown>;
  const leadType: LeadType =
    b.leadType === "buyer"
      ? "buyer"
      : b.leadType === "condo"
        ? "condo"
        : b.leadType === "lakeside"
          ? "lakeside"
          : "seller";

  if (
    !b.name ||
    typeof b.name !== "string" ||
    (b.name as string).trim().length === 0 ||
    (b.name as string).trim().length > MAX.name
  ) {
    return { valid: false, error: "Name is required." };
  }
  if (
    !b.email ||
    typeof b.email !== "string" ||
    (b.email as string).trim().length > MAX.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email as string)
  ) {
    return { valid: false, error: "A valid email address is required." };
  }
  if (
    !b.phone ||
    typeof b.phone !== "string" ||
    (b.phone as string).trim().length > MAX.phone ||
    // Require 10–15 actual digits (US + international), ignoring spaces,
    // dashes, parens, leading "+". Catches empty / junk / clearly-fake input.
    (b.phone as string).replace(/\D/g, "").length < 10 ||
    (b.phone as string).replace(/\D/g, "").length > 15
  ) {
    return { valid: false, error: "A valid phone number is required." };
  }

  if (leadType === "seller") {
    if (
      !b.propertyAddress ||
      typeof b.propertyAddress !== "string" ||
      (b.propertyAddress as string).trim().length === 0
    ) {
      return { valid: false, error: "Property address is required." };
    }
    if (!b.propertyType || typeof b.propertyType !== "string") {
      return { valid: false, error: "Property type is required." };
    }
    if (!b.estimatedValue || typeof b.estimatedValue !== "string") {
      return { valid: false, error: "Estimated value is required." };
    }
    if (!b.timeline || typeof b.timeline !== "string") {
      return { valid: false, error: "Timeline is required." };
    }
    if (!b.reasonForSelling || typeof b.reasonForSelling !== "string") {
      return { valid: false, error: "Reason for selling is required." };
    }
  }

  const str = (k: string, max: number = MAX.shortField) =>
    typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "";

  // Parse attribution sub-object — only keep string values
  const rawAttr = b.attribution;
  const attribution: Attribution = {};
  if (rawAttr && typeof rawAttr === "object") {
    const a = rawAttr as Record<string, unknown>;
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
      "landing_page",
      "referrer",
    ] as const) {
      if (typeof a[key] === "string" && (a[key] as string).trim().length > 0) {
        attribution[key] = (a[key] as string).trim().slice(0, MAX.attrValue);
      }
    }
  }

  return {
    valid: true,
    data: {
      leadType,
      name: (b.name as string).trim(),
      email: (b.email as string).trim(),
      phone: (b.phone as string).trim(),
      bestTime: str("bestTime"),
      additionalDetails: str("additionalDetails", MAX.longText),
      propertyAddress: str("propertyAddress"),
      propertyType: str("propertyType"),
      estimatedValue: str("estimatedValue"),
      timeline: str("timeline"),
      reasonForSelling: str("reasonForSelling", MAX.longText),
      priceRange: str("priceRange"),
      buyerTimeline: str("buyerTimeline"),
      currentlyOwn: str("currentlyOwn"),
      unitSize: str("unitSize"),
      intendedUse: str("intendedUse"),
      condoTimeline: str("condoTimeline"),
      residence: str("residence"),
      buyingAs: str("buyingAs"),
      areasOfInterest: Array.isArray(b.areasOfInterest)
        ? (b.areasOfInterest as unknown[])
            .filter((v): v is string => typeof v === "string")
            .slice(0, MAX.arrayItems)
            .map((v) => v.slice(0, MAX.shortField))
        : [],
      attribution,
    },
  };
}

/**
 * Best-guess channel from captured UTMs / click IDs. Used to tag the FUB lead
 * (e.g. "google", "meta", "organic") so leads can be filtered by source quickly.
 */
function inferChannel(a: Attribution): string {
  if (a.utm_source) {
    const s = a.utm_source.toLowerCase();
    if (s.includes("google")) return "google";
    if (s.includes("facebook") || s.includes("meta") || s.includes("instagram"))
      return "meta";
    return s;
  }
  if (a.gclid) return "google";
  if (a.fbclid) return "meta";
  return "organic";
}

function buildMessage(lead: LeadPayload): string {
  const lines: string[] = [];

  if (lead.leadType === "seller") {
    if (lead.propertyAddress) lines.push(`Property Address: ${lead.propertyAddress}`);
    if (lead.propertyType) lines.push(`Property Type: ${lead.propertyType}`);
    if (lead.estimatedValue) lines.push(`Estimated Value: ${lead.estimatedValue}`);
    if (lead.timeline) lines.push(`Timeline to Sell: ${lead.timeline}`);
    if (lead.reasonForSelling) lines.push(`Reason for Selling: ${lead.reasonForSelling}`);
  } else if (lead.leadType === "condo") {
    if (lead.unitSize) lines.push(`Unit Size of Interest: ${lead.unitSize}`);
    if (lead.intendedUse) lines.push(`Intended Use: ${lead.intendedUse}`);
    if (lead.condoTimeline) lines.push(`Purchase Timeline: ${lead.condoTimeline}`);
  } else if (lead.leadType === "lakeside") {
    if (lead.residence) lines.push(`Residence of Interest: ${lead.residence}`);
    if (lead.priceRange) lines.push(`Budget: ${lead.priceRange}`);
    if (lead.buyingAs) lines.push(`Buying As: ${lead.buyingAs}`);
    if (lead.condoTimeline) lines.push(`Purchase Timeline: ${lead.condoTimeline}`);
  } else {
    if (lead.areasOfInterest && lead.areasOfInterest.length > 0) {
      lines.push(`Areas of Interest: ${lead.areasOfInterest.join(", ")}`);
    }
    if (lead.priceRange) lines.push(`Price Range: ${lead.priceRange}`);
    if (lead.buyerTimeline) lines.push(`Visit / Buy Timeline: ${lead.buyerTimeline}`);
    if (lead.currentlyOwn) lines.push(`Currently Owns Home: ${lead.currentlyOwn}`);
  }

  if (lead.bestTime) lines.push(`Best Time to Reach: ${lead.bestTime}`);
  if (lead.additionalDetails) lines.push(`Additional Details: ${lead.additionalDetails}`);

  // Attribution block — only render if we actually captured something.
  // Goes at the bottom so the human-relevant info (property, timeline, etc.)
  // stays at the top of the FUB note.
  const a = lead.attribution || {};
  const attrEntries = Object.entries(a).filter(([, v]) => typeof v === "string" && v.length > 0);
  if (attrEntries.length > 0) {
    lines.push("");
    lines.push("— Source / Attribution —");
    lines.push(`Channel (inferred): ${inferChannel(a)}`);
    for (const [k, v] of attrEntries) {
      lines.push(`${k}: ${v}`);
    }
  }

  return lines.join("\n");
}

async function createFubLead(lead: LeadPayload) {
  if (!FUB_API_KEY) {
    console.warn("FUB_API_KEY not set — skipping Follow Up Boss integration");
    return { ok: false, reason: "no_api_key" as const };
  }

  const isSeller = lead.leadType === "seller";
  const isCondo = lead.leadType === "condo";
  const isLakeside = lead.leadType === "lakeside";
  const baseSource = isSeller
    ? "LHNI Sellers LP"
    : isCondo
      ? "Locked & Loaded LP"
      : isLakeside
        ? "LHNI One Lakeside LP"
        : "LHNI Buyers LP";
  const baseTag = isSeller
    ? "Seller"
    : isCondo
      ? "Garage Condo"
      : isLakeside
        ? "One Lakeside"
        : "Buyer";
  const type =
    isCondo || isLakeside
      ? "Property Inquiry"
      : isSeller
        ? "Seller Inquiry"
        : "Buyer Inquiry";

  // Infer the channel and bake it into both the source string AND a tag.
  // FUB's "Source" is the field most agents filter on at a glance; the channel
  // tag gives a second axis to slice by (e.g. show me all Meta leads).
  const channel = inferChannel(lead.attribution || {});
  const source = channel === "organic" ? baseSource : `${baseSource} — ${channel}`;
  const tags = channel === "organic" ? [baseTag] : [baseTag, channel];

  const nameParts = lead.name.trim().split(/\s+/);
  const firstName = nameParts[0] || lead.name.trim();
  const lastName = nameParts.slice(1).join(" ") || "";

  const payload = {
    source,
    type,
    message: buildMessage(lead),
    person: {
      firstName,
      lastName,
      emails: [{ value: lead.email, type: "home" }],
      phones: [{ value: lead.phone, type: "mobile" }],
      tags,
    },
  };

  const auth = Buffer.from(`${FUB_API_KEY}:`).toString("base64");

  try {
    const res = await fetch("https://api.followupboss.com/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        "X-System": "LHNI Landing Page",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("Follow Up Boss API error:", res.status, errBody);
      return { ok: false as const, reason: "fub_error" as const };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("Follow Up Boss API exception:", err);
    return { ok: false as const, reason: "fub_exception" as const };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = validate(body);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    await createFubLead(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry. Greg will be in touch shortly.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
