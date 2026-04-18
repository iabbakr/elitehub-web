import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceProvidersListing from "@/components/services/ServiceProvidersListing";

// ── Category metadata ─────────────────────────────────────────────────────────

export const SERVICE_CATEGORIES_META: Record<string, { label: string; icon: string; desc: string }> = {
  Home_Repair_Maintenance:   { label: "Home Repair & Maintenance",   icon: "🔧", desc: "Plumbers, electricians, painters, AC technicians and more across Nigeria." },
  Cleaning_Services:         { label: "Cleaning Services",           icon: "🧹", desc: "House cleaning, office cleaning, fumigation and post-construction cleaning." },
  Logistics_Transport:       { label: "Logistics & Transport",       icon: "🚚", desc: "Delivery riders, relocation services, haulage and private drivers." },
  Events_Entertainment:      { label: "Events & Entertainment",      icon: "🎉", desc: "Event planners, photographers, DJs, caterers and MCs near you." },
  Tech_Gadgets_Repair:       { label: "Tech & Gadget Repair",        icon: "💻", desc: "Phone repair, laptop repair, TV, CCTV installation and networking." },
  Automotive_Services:       { label: "Automotive Services",         icon: "🚗", desc: "Mechanics, auto electricians, car wash, towing and vulcanizers." },
  Education_Lessons:         { label: "Tutors & Lessons",            icon: "📚", desc: "Home tutors, music teachers, driving instructors and coding coaches." },
  Health_Wellness:           { label: "Health & Wellness",           icon: "💪", desc: "Fitness trainers, home nurses, massage therapists and nutritionists." },
  Business_Professional:     { label: "Business & Professional",     icon: "💼", desc: "Graphic designers, developers, lawyers, accountants and marketing consultants." },
  Personal_Services:         { label: "Beauty & Personal Services",  icon: "✂️", desc: "Tailors, hairstylists, makeup artists, barbers and nail technicians." },
  Real_Estate_Services:      { label: "Real Estate Services",        icon: "🏢", desc: "Property agents, facility managers, surveyors and property valuers." },
  Construction_Fabrication:  { label: "Construction & Fabrication",  icon: "🏗️", desc: "Welders, woodworkers, tilers, POP artists and block layers." },
};

// ── SEO metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = SERVICE_CATEGORIES_META[category];
  if (!meta) return {};

  const title = `${meta.label} in Nigeria | EliteHub NG`;
  const description = `Find trusted, verified ${meta.label} providers near you — rated by real customers across all 36 states. ${meta.desc}`;

  return {
    title,
    description,
    alternates: { canonical: `https://elitehubng.com/services/${category}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://elitehubng.com/services/${category}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!SERVICE_CATEGORIES_META[category]) {
    notFound();
  }

  return <ServiceProvidersListing category={category} />;
}