import type { Metadata } from "next";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers at EliteHub NG — Join Our Team",
  description:
    "Join the team building Nigeria's most trusted marketplace. We're looking for passionate people who want to transform online commerce in Africa.",
  alternates: { canonical: "https://elitehubng.com/careers" },
};

const PERKS = [
  "Competitive salary in NGN",
  "Remote-friendly work culture",
  "Fast-growing startup environment",
  "Direct impact on millions of Nigerians",
  "Health & wellness support",
  "Learning & development budget",
];

const OPEN_ROLES = [
  { dept: "Engineering",  title: "Mobile Developer (React Native)",   type: "Full-time · Remote" },
  { dept: "Engineering",  title: "Backend Engineer (Node.js/Firebase)", type: "Full-time · Remote" },
  { dept: "Operations",   title: "Customer Support Specialist",        type: "Full-time · Abuja or Lagos" },
  { dept: "Growth",       title: "Digital Marketing Manager",          type: "Full-time · Remote" },
  { dept: "Trust & Safety", title: "Seller Verification Analyst",     type: "Full-time · Abuja" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero */}
      <div className="bg-navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-faint blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="section relative py-16 md:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 font-body">
            <a href="/" className="hover:text-gold-DEFAULT transition-colors">Home</a>
            <span>/</span>
            <span className="text-white/70">Careers</span>
          </nav>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT text-sm font-semibold mb-5 font-body">
              💼 We&apos;re Hiring
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              Build the Future of Nigerian{" "}
              <span className="text-gold-DEFAULT">Commerce</span>
            </h1>
            <p className="text-white/65 text-lg leading-relaxed font-body">
              Join a passionate team building Nigeria&apos;s most trusted
              marketplace. We value ownership, impact, and genuine care for our
              users.
            </p>
          </div>
        </div>
      </div>

      {/* Perks */}
      <section className="py-16 bg-white">
        <div className="section">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">Why Join EliteHub NG?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {PERKS.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 bg-[#F8F7F4] rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)]"
              >
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                <span className="text-sm text-navy-DEFAULT/80 font-body">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16 bg-[#F8F7F4]">
        <div className="section">
          <div className="mb-8">
            <h2 className="section-title mb-2">Open Positions</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">
              Interested? Send your CV and role of interest to{" "}
              <a
                href="mailto:careers@elitehubng.com"
                className="text-gold-DEFAULT hover:underline font-semibold"
              >
                careers@elitehubng.com
              </a>
            </p>
          </div>

          <div className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.title}
                className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.06)] hover:border-gold-muted hover:shadow-gold transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold-DEFAULT font-body">
                    {role.dept}
                  </span>
                  <h3 className="font-display font-semibold text-navy-DEFAULT text-base mt-0.5">
                    {role.title}
                  </h3>
                  <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">
                    {role.type}
                  </p>
                </div>
                <a
                  href={`mailto:careers@elitehubng.com?subject=Application: ${role.title}`}
                  className="btn-ghost px-5 py-2.5 text-sm shrink-0"
                >
                  Apply <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-navy-DEFAULT/50 text-sm font-body mb-3">
              Don&apos;t see your role? We&apos;re always open to exceptional talent.
            </p>
            <a
              href="mailto:careers@elitehubng.com?subject=Open Application"
              className="btn-gold px-8 py-3.5 rounded-2xl text-sm inline-flex"
            >
              Send an Open Application <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}