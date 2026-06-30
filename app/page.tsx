import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import CounterAnimation from "@/components/scroll/CounterAnimation";
import FadeIn from "@/components/scroll/FadeIn";
import TextReveal from "@/components/scroll/TextReveal";
import OneLakesideForm from "@/components/lhni/OneLakesideForm";
import ResidenceMedia from "@/components/lhni/ResidenceMedia";
import ResidenceGallery from "@/components/lhni/ResidenceGallery";

export const metadata: Metadata = {
  title: "One Lakeside — Luxury Lakefront Condos in Downtown Coeur d'Alene",
  description:
    "Own a residence at One Lakeside — the premier waterfront condo tower in downtown Coeur d'Alene, Idaho. Studios to 2-bedroom homes from the $590,000s with a rooftop terrace, hot tub, fitness center, and the lake at your door. Presented by Luxury Homes North Idaho.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "One Lakeside — Lakefront Condos in Downtown Coeur d'Alene",
    description:
      "The only residential tower on the water in downtown Coeur d'Alene. Furnished lakefront residences from the $590,000s. Rooftop terrace, hot tub, fitness, and the lake at your door.",
    type: "website",
    images: [
      {
        url: "/one-lakeside/one-lakeside-og.jpg",
        width: 1200,
        height: 630,
        alt: "Aerial view of One Lakeside condo tower beside Lake Coeur d'Alene, Idaho",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Lakeside — Lakefront Condos in Downtown Coeur d'Alene",
    description:
      "Furnished lakefront residences from the $590,000s. Rooftop terrace, hot tub, fitness, and the lake at your door.",
    images: ["/one-lakeside/one-lakeside-og.jpg"],
  },
};

const YOUTUBE_TOUR_ID = "ew3hPTWoqRM"; // "Luxury Condos Near Lake in Downtown Coeur d'Alene"

// Matterport model IDs per residence (unbranded tours loaded on demand via the
// modal in ResidenceMedia — see that component for the lazy-load rationale).
const MATTERPORT_IDS: Record<string, string> = {
  "401": "oLDwGM5sJpH",
  "402": "te48mi2sz1e",
  "403": "Qwhhmcxqk5G",
  "408": "W1R8iwJgub1",
  "410": "3qWMUqzZz2f",
};

/* ----------------------------------------------------------------------------
   RESIDENCE DATA
   Specs for 403 / 408 / 410 are from the active MLS listings. 401 & 402 are the
   building's larger corner residences — confirm exact bed count + price with the
   team before publishing (shown here as "Pricing on request", which also doubles
   as a lead driver).
---------------------------------------------------------------------------- */
const residences = [
  {
    unit: "401",
    name: "Residence 401",
    beds: "2 Bed",
    baths: "2 Bath",
    sqft: null as string | null,
    price: "Pricing on request",
    facing: "Corner Residence",
    tagline: "The largest floor plan — a corner home with lake & resort views.",
    blurb:
      "A rare corner residence with two bedrooms, an open great room wrapped in glass, a full chef's kitchen, and a private deck framing the lake and the resort. The building's most spacious layout.",
    images: [
      { src: "/one-lakeside/one-lakeside-unit-401-living-room.jpg", alt: "Living room of Residence 401 at One Lakeside with floor-to-ceiling windows and lake views" },
      { src: "/one-lakeside/one-lakeside-unit-401-great-room.jpg", alt: "Open great room of Residence 401 with lake views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-401-dining.jpg", alt: "Dining area of Residence 401 overlooking Lake Coeur d'Alene" },
      { src: "/one-lakeside/one-lakeside-unit-401-kitchen.jpg", alt: "Island kitchen in Residence 401 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-401-primary-bedroom.jpg", alt: "Primary bedroom of Residence 401 with lake views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-401-second-bedroom.jpg", alt: "Second bedroom in Residence 401 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-401-bathroom.jpg", alt: "Bathroom with double vanity in Residence 401 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-401-lake-view-deck.jpg", alt: "Private deck of Residence 401 overlooking Lake Coeur d'Alene and the resort" },
    ],
  },
  {
    unit: "402",
    name: "Residence 402",
    beds: "2 Bed",
    baths: "2 Bath",
    sqft: null,
    price: "Pricing on request",
    facing: "Corner Residence",
    tagline: "A designer two-bedroom corner home above the water.",
    blurb:
      "Sunlight on three sides, an island kitchen, in-residence laundry, and a wraparound deck that takes in the lake, the marina, and downtown all at once. Offered beautifully furnished.",
    images: [
      { src: "/one-lakeside/one-lakeside-unit-402-living-room.jpg", alt: "Open living room of Residence 402 at One Lakeside with corner windows and designer furnishings" },
      { src: "/one-lakeside/one-lakeside-unit-402-great-room.jpg", alt: "Great room of Residence 402 with blue furnishings and lake views" },
      { src: "/one-lakeside/one-lakeside-unit-402-island-kitchen.jpg", alt: "Island kitchen in Residence 402 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-402-dining.jpg", alt: "Dining nook of Residence 402 with lake views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-402-primary-bedroom.jpg", alt: "Primary bedroom of Residence 402 with lake views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-402-second-bedroom.jpg", alt: "Second bedroom in Residence 402 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-402-bathroom.jpg", alt: "Bathroom with double vanity in Residence 402 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-402-lake-downtown-deck.jpg", alt: "Wraparound deck of Residence 402 overlooking the lake and downtown Coeur d'Alene" },
    ],
  },
  {
    unit: "403",
    name: "Residence 403",
    beds: "1 Bed",
    baths: "1 Bath",
    sqft: "881 sq ft",
    price: "$649,000",
    facing: "West / Lake View",
    tagline: "The largest one-bedroom — west-facing with a lake-view deck.",
    blurb:
      "A bright, west-facing one-bedroom with the most square footage of the one-bed homes, a full kitchen with island seating, in-residence laundry, and a lakeview deck for the sunset. Offered fully furnished.",
    images: [
      { src: "/one-lakeside/one-lakeside-unit-403-living-room.jpg", alt: "Living room of Residence 403 at One Lakeside with west-facing windows and lake views" },
      { src: "/one-lakeside/one-lakeside-unit-403-great-room.jpg", alt: "Great room of Residence 403 with seating and lake views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-403-dining.jpg", alt: "Dining nook of Residence 403 beside the lake-view deck" },
      { src: "/one-lakeside/one-lakeside-unit-403-kitchen.jpg", alt: "Full kitchen with island in Residence 403 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-403-bedroom.jpg", alt: "Bedroom in Residence 403 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-403-bathroom.jpg", alt: "Bathroom in Residence 403 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-403-west-lake-view-deck.jpg", alt: "West-facing lake-view deck of Residence 403 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-403-lake-panorama.jpg", alt: "Lake Coeur d'Alene panorama from the deck of Residence 403" },
    ],
  },
  {
    unit: "408",
    name: "Residence 408",
    beds: "1 Bed",
    baths: "1 Bath",
    sqft: "779 sq ft",
    price: "$629,000",
    facing: "Oversized Terrace",
    tagline: "A one-bedroom with an enormous private terrace over the city.",
    blurb:
      "An east-facing one-bedroom whose standout feature is the oversized private terrace — room to dine, lounge, and entertain above downtown, with peek-a-boo lake views. Offered fully furnished.",
    images: [
      { src: "/one-lakeside/one-lakeside-unit-408-living-room.jpg", alt: "Living room of Residence 408 at One Lakeside opening to an oversized private terrace" },
      { src: "/one-lakeside/one-lakeside-unit-408-living-dining.jpg", alt: "Living and dining area in Residence 408 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-408-dining.jpg", alt: "Dining area of Residence 408 with downtown views" },
      { src: "/one-lakeside/one-lakeside-unit-408-kitchen.jpg", alt: "Kitchen in Residence 408 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-408-bedroom.jpg", alt: "Bedroom in Residence 408 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-408-bathroom.jpg", alt: "Bathroom in Residence 408 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-408-private-terrace.jpg", alt: "Oversized private terrace of Residence 408 overlooking downtown Coeur d'Alene" },
      { src: "/one-lakeside/one-lakeside-unit-408-terrace-city-view.jpg", alt: "Private terrace lounge of Residence 408 with downtown city views" },
    ],
  },
  {
    unit: "410",
    name: "Residence 410",
    beds: "1 Bed",
    baths: "1 Bath",
    sqft: "789 sq ft",
    price: "$599,000",
    facing: "Accessible",
    tagline: "A single-level, fully accessible one-bedroom with a big terrace.",
    blurb:
      "An east-facing, ADA-accessible one-bedroom with a step-free layout, roll-in shower, full kitchen, in-residence laundry, and a generous private terrace overlooking the city. Offered fully furnished.",
    images: [
      { src: "/one-lakeside/one-lakeside-unit-410-living-room.jpg", alt: "Living room of Residence 410 at One Lakeside, a single-level accessible home" },
      { src: "/one-lakeside/one-lakeside-unit-410-great-room.jpg", alt: "Great room of Residence 410 with striped rug and city views" },
      { src: "/one-lakeside/one-lakeside-unit-410-dining.jpg", alt: "Dining area and kitchen in Residence 410 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-410-kitchen.jpg", alt: "Kitchen in Residence 410 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-410-bedroom.jpg", alt: "Bedroom in Residence 410 with city views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-410-accessible-bathroom.jpg", alt: "Accessible bathroom with roll-in shower in Residence 410 at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-410-terrace-city-view.jpg", alt: "Private terrace of Residence 410 with city views at One Lakeside" },
      { src: "/one-lakeside/one-lakeside-unit-410-terrace.jpg", alt: "Private terrace seating of Residence 410 at One Lakeside" },
    ],
  },
];

const amenities = [
  {
    src: "/one-lakeside/one-lakeside-rooftop-terrace-lake-view.jpg",
    label: "Rooftop Terrace",
    caption: "Panoramic lake & mountain views",
    span: "lg:col-span-2 lg:row-span-2",
    ratio: "aspect-[4/3] lg:aspect-auto lg:h-full",
  },
  {
    src: "/one-lakeside/one-lakeside-rooftop-hot-tub-fire-pit.jpg",
    label: "Hot Tub & Fire Pits",
    caption: "Unwind under the stars",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/one-lakeside/one-lakeside-resident-club-room-fireplace.jpg",
    label: "Resident Club Room",
    caption: "Fireplace lounge & kitchen",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/one-lakeside/one-lakeside-fitness-center.jpg",
    label: "Fitness Center",
    caption: "Train without leaving home",
    span: "",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/one-lakeside/one-lakeside-rooftop-dog-run.jpg",
    label: "Dog Run",
    caption: "Pet-friendly, right on-site",
    span: "",
    ratio: "aspect-[4/3]",
  },
];

export default function OneLakesidePage() {
  return (
    <div className="one-lakeside">
      {/* ============================================================
          HERO — aerial of the tower beside Lake Coeur d'Alene
          ============================================================ */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <Image
          src="/one-lakeside/one-lakeside-coeur-dalene-lakefront-aerial.jpg"
          alt="Aerial view of One Lakeside condo tower beside Lake Coeur d'Alene in downtown Idaho"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Soft bottom-weighted scrim — keeps the photo airy up top, text legible below */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10171c]/88 via-[#10171c]/45 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pb-20 md:pb-28">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <p className="ol-eyebrow text-xs md:text-sm mb-5 text-[#e6d3a8]">
                Downtown Coeur d&apos;Alene, Idaho
              </p>
            </FadeIn>

            <TextReveal
              tag="h1"
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6"
              type="words"
              stagger={0.05}
            >
              Live on the Water at One Lakeside
            </TextReveal>

            <FadeIn delay={0.5}>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-9 leading-relaxed">
                The only residential tower on the water in downtown Coeur
                d&apos;Alene. Furnished lakefront residences from the
                $590,000s — steps from the lake, the marina, and Sherman
                Avenue.
              </p>
            </FadeIn>

            <FadeIn delay={0.7}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#inquire"
                  className="ol-btn-gold inline-block px-9 py-4 rounded-lg text-base text-center"
                >
                  Request Pricing &amp; a Tour
                </a>
                <a
                  href="#residences"
                  className="inline-block px-9 py-4 rounded-lg text-base text-center border border-white/40 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  View the Residences
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ============================================================
          INTRO — the building story
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="ol-gold-line mx-auto mb-7" />
            <p className="ol-eyebrow text-xs mb-5">An Address Like No Other</p>
          </FadeIn>
          <TextReveal
            tag="h2"
            className="text-3xl md:text-4xl lg:text-5xl mb-7 leading-tight"
            type="words"
            stagger={0.03}
          >
            Where downtown meets the lake
          </TextReveal>
          <FadeIn delay={0.2}>
            <p className="text-[#50606a] text-lg md:text-xl leading-relaxed">
              One Lakeside is the rarest thing in Coeur d&apos;Alene — a
              residence where you can step out your door to the water, the
              marina, and the best of Sherman Avenue, then ride the elevator
              home to a rooftop terrace with the whole lake at your feet. These
              are turnkey, fully furnished homes in the heart of it all. Lock
              the door, head to the lake, and live the North Idaho life you
              came for.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          STATS BAR
          ============================================================ */}
      <section className="py-16 md:py-20 bg-[#f1eee8] border-y border-[#ddd6ca]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-[#b08d4f] mb-2">
                  <CounterAnimation end={16} duration={2.2} />
                </div>
                <p className="text-sm text-[#50606a] uppercase tracking-wider">
                  Stories Above the Lake
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-[#b08d4f] mb-2">
                  <CounterAnimation end={5} duration={2.2} />
                </div>
                <p className="text-sm text-[#50606a] uppercase tracking-wider">
                  Residences Available
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-[#b08d4f] mb-2 pt-1">
                  Rooftop
                </div>
                <p className="text-sm text-[#50606a] uppercase tracking-wider">
                  Terrace, Hot Tub &amp; Fire Pits
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-[#b08d4f] mb-2 pt-1">
                  Steps
                </div>
                <p className="text-sm text-[#50606a] uppercase tracking-wider">
                  To the Lake &amp; Dining
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          VIDEO TOUR — YouTube
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="ol-gold-line mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
              Take the tour
            </h2>
            <p className="text-[#50606a] text-lg max-w-2xl mx-auto leading-relaxed">
              See the building, the rooftop, and the lake the way you&apos;ll
              live it — a few minutes inside One Lakeside.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#ddd6ca] shadow-xl">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={`https://www.youtube.com/embed/${YOUTUBE_TOUR_ID}`}
                  title="One Lakeside — Luxury Condos Near the Lake in Downtown Coeur d'Alene"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          THE RESIDENCES — one alternating section per unit
          ============================================================ */}
      <section id="residences" className="py-20 md:py-28 bg-[#f1eee8] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-16 md:mb-20">
            <span className="ol-gold-line mx-auto mb-6" />
            <p className="ol-eyebrow text-xs mb-5">Five Homes Available</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
              Choose your residence
            </h2>
            <p className="text-[#50606a] text-lg max-w-2xl mx-auto leading-relaxed">
              From a turnkey one-bedroom to the building&apos;s largest corner
              homes — each offered fully furnished and move-in ready.
            </p>
          </FadeIn>

          <div className="space-y-20 md:space-y-28">
            {residences.map((r, i) => {
              const flip = i % 2 === 1;
              return (
                <FadeIn key={r.unit}>
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    {/* Image gallery — click any photo to open the lightbox */}
                    <div className={flip ? "lg:order-2" : ""}>
                      <ResidenceGallery name={r.name} images={r.images} />
                    </div>

                    {/* Detail */}
                    <div className={flip ? "lg:order-1" : ""}>
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="ol-eyebrow text-xs">{r.name}</p>
                        <span className="text-[#b08d4f] text-xs uppercase tracking-widest">
                          · {r.facing}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl mb-4 leading-snug">
                        {r.tagline}
                      </h3>

                      {/* Spec row */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-5">
                        <span className="text-[#1f2a30] font-medium">
                          {r.beds}
                        </span>
                        <span className="w-px h-4 bg-[#ddd6ca]" />
                        <span className="text-[#1f2a30] font-medium">
                          {r.baths}
                        </span>
                        {r.sqft && (
                          <>
                            <span className="w-px h-4 bg-[#ddd6ca]" />
                            <span className="text-[#1f2a30] font-medium">
                              {r.sqft}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-[#50606a] leading-relaxed mb-6">
                        {r.blurb}
                      </p>

                      {/* 3D tour + floor plan (lazy — load only on click) */}
                      <div className="mb-7">
                        <ResidenceMedia
                          name={r.name}
                          matterportId={MATTERPORT_IDS[r.unit]}
                          floorPlanSrc={`/one-lakeside/one-lakeside-unit-${r.unit}-floor-plan.jpg`}
                        />
                      </div>

                      {/* Price + CTA */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#ddd6ca]">
                        <div>
                          <p className="text-xs text-[#8a97a0] uppercase tracking-wider mb-0.5">
                            {r.price === "Pricing on request"
                              ? "Offered At"
                              : "Listed At"}
                          </p>
                          <p className="text-2xl font-semibold text-[#1f2a30]">
                            {r.price}
                          </p>
                        </div>
                        <Link
                          href={`/?unit=${r.unit}#inquire`}
                          scroll
                          className="ol-btn-outline inline-block px-6 py-3 rounded-lg text-sm"
                        >
                          Inquire About {r.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          AMENITIES — building lifestyle
          ============================================================ */}
      <section className="py-20 md:py-28 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-14 md:mb-16">
            <span className="ol-gold-line mx-auto mb-6" />
            <p className="ol-eyebrow text-xs mb-5">Life at One Lakeside</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
              Amenities that feel like a resort
            </h2>
            <p className="text-[#50606a] text-lg max-w-2xl mx-auto leading-relaxed">
              Ownership comes with the whole building — a rooftop made for
              sunsets, a club room for gathering, and everything you need
              without leaving home.
            </p>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:auto-rows-[minmax(0,1fr)]">
              {amenities.map((a) => (
                <div
                  key={a.src}
                  className={`ol-zoom ol-card relative rounded-xl overflow-hidden group ${a.span}`}
                >
                  <div className={`relative ${a.ratio}`}>
                    <Image
                      src={a.src}
                      alt={`${a.label} at One Lakeside in Coeur d'Alene`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10171c]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white text-lg md:text-xl mb-0.5">
                        {a.label}
                      </h3>
                      <p className="text-white/80 text-sm">{a.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          LOCATION — big statement with marina aerial
          ============================================================ */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <Image
          src="/one-lakeside/one-lakeside-downtown-coeur-dalene-marina-aerial.jpg"
          alt="Aerial of One Lakeside, the marina, and downtown Coeur d'Alene"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#10171c]/55" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <span className="ol-gold-line mx-auto mb-7 bg-[#e6d3a8]" />
            <p className="ol-eyebrow text-xs mb-5 text-[#e6d3a8]">The Location</p>
          </FadeIn>
          <TextReveal
            tag="h2"
            className="text-white text-3xl md:text-4xl lg:text-5xl mb-7 leading-tight"
            type="words"
            stagger={0.03}
          >
            The whole lake, right outside your door
          </TextReveal>
          <FadeIn delay={0.3}>
            <p className="text-white/85 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
              Walk to Independence Point, the Coeur d&apos;Alene Resort, the
              boardwalk, and dozens of restaurants and shops along Sherman
              Avenue. Keep the boat at the marina, take the kids to City Beach,
              and watch the sunset from the rooftop. This is downtown
              Coeur d&apos;Alene at its most effortless.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { k: "On the Water", v: "Downtown CdA" },
                { k: "To the Lake", v: "Steps Away" },
                { k: "Marina & Resort", v: "Right Outside" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-7 py-4"
                >
                  <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
                    {s.k}
                  </p>
                  <p className="text-lg font-semibold text-[#e6d3a8]">{s.v}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          INQUIRY FORM
          ============================================================ */}
      <section id="inquire" className="py-20 md:py-28 bg-[#f1eee8] scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="ol-gold-line mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4">
              Request pricing &amp; a private tour
            </h2>
            <p className="text-[#50606a] text-lg max-w-2xl mx-auto leading-relaxed">
              Tell us which residence caught your eye and Greg&apos;s team will
              reach out with current pricing, availability, and a time to walk
              the building. No pressure — just answers.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="ol-card rounded-2xl p-7 md:p-10">
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center text-[#8a97a0]">
                    Loading…
                  </div>
                }
              >
                <OneLakesideForm />
              </Suspense>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="text-center mt-9">
            <p className="text-[#8a97a0] text-sm">
              Prefer to talk? Call Greg directly:{" "}
              <a
                href="tel:2086596527"
                className="text-[#b08d4f] hover:text-[#c9a96e] transition-colors font-medium"
              >
                208-659-6527
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================
          CLOSING BAND
          ============================================================ */}
      <div className="bg-[#1f2a30] py-12 px-6 text-center">
        <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
          One Lakeside · 201 1st Avenue, Coeur d&apos;Alene, Idaho · Presented by
          Greg Rowley and the team at{" "}
          <span className="text-[#e6d3a8]">Luxury Homes North Idaho</span>.
        </p>
      </div>
    </div>
  );
}
