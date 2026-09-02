import React from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  Heart,
  ShieldCheck,
  Building2,
  Activity,
  Compass,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { SEOHelmet } from '../components/SEOHelmet';

export const SDG3: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEOHelmet
        title="SDG 3 — Good Health and Well-Being"
        description="Explore how HEALTHCARE advances United Nations Sustainable Development Goal 3 through medical discovery, early screening, and geospatial access."
      />

      {/* Hero Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-800 text-emerald-300">
            <Globe2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
            United Nations Global Goal 3
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-tight">
          SDG 3 — Good Health and Well-Being
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Ensure healthy lives and promote well-being for all at all ages. HEALTHCARE contributes to this global vision by democratizing access to authentic medical institution information, responsible early-risk screening, and patient vital monitoring.
        </p>

        <p className="text-[11px] text-emerald-200/80 italic pt-2">
          * Note: This academic and discovery project aligns with the principles of the UN Sustainable Development Goals and does not claim official United Nations endorsement.
        </p>
      </div>

      {/* Target Focus Pillars */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Target Alignment
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            How HEALTHCARE Supports Target 3.8 & Digital Health
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Healthcare Discovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides citizens and families with transparent, verified NIRF 2025 ranking data across 50 premier medical institutions in India without advertising bias.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Geospatial Equity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equips users with precise coordinates and Haversine distance computations to locate regional medical centers and tertiary care hospitals efficiently.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Early Risk Awareness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowers proactive self-care through transparent, rule-based screening tools that prompt timely clinical consultation before conditions escalate.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-slate-900">
          Target 3.8: Achieving Universal Health Coverage (UHC)
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Universal health coverage requires that all people have access to the full spectrum of quality health services without suffering financial hardship. Digital platforms serve as a vital informational bridge by helping patients identify accredited tertiary medical colleges, teaching hospitals, and state-of-the-art public healthcare infrastructure.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Encourages routine vital telemetry tracking</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Reduces informational barriers to premier medical centers</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Fosters awareness of cardiovascular & metabolic risks</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Open, unmonetized public-good access</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-teal-800 text-white shadow-md">
        <div className="space-y-1">
          <h4 className="font-bold text-base">Explore NIRF 2025 Healthcare Centers</h4>
          <p className="text-xs text-teal-100">Find medical institutions ranked by quality and research excellence.</p>
        </div>
        <Link
          to="/find-healthcare"
          className="px-5 py-2.5 bg-white text-teal-900 rounded-xl font-bold text-xs hover:bg-teal-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Find Healthcare</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
