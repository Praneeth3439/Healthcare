import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Globe2,
  Sparkles,
} from 'lucide-react';
import { SEOHelmet } from '../components/SEOHelmet';

export const SDG4: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEOHelmet
        title="SDG 4 — Quality Education"
        description="Learn how HEALTHCARE supports UN Sustainable Development Goal 4 through medical education discovery, clinical academic ranking transparency, and health literacy."
      />

      {/* Hero Header */}
      <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-rose-950 via-red-900 to-slate-900 text-white shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-rose-800 text-rose-300">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300">
            United Nations Global Goal 4
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold leading-tight">
          SDG 4 — Quality Education
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all. In healthcare, quality medical education is the cornerstone of sustainable clinical systems, patient safety, and lifelong health literacy.
        </p>

        <p className="text-[11px] text-rose-200/80 italic pt-2">
          * Note: This academic and discovery project aligns with the principles of the UN Sustainable Development Goals and does not claim official United Nations endorsement.
        </p>
      </div>

      {/* Key Focus Areas */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            Academic Pillars
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            Promoting Medical Excellence and Health Literacy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Medical Academic Excellence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              NIRF 2025 rankings benchmark medical institutions on teaching, learning, faculty qualifications, research publications, and graduate outcomes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Preventive Health Literacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Demystifies clinical metrics (blood pressure, fasting glucose, BMI categories, resting heart rate) with accessible, science-backed educational explanations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Empowering Students & Scholars</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides aspiring doctors, medical students, and researchers with structured access to accredited training institutions across 18 states and union territories.
            </p>
          </div>
        </div>
      </div>

      {/* NIRF Framework Explanation */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
        <h3 className="text-xl font-bold text-slate-900">
          The Role of NIRF in Medical Education Quality Assurance
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The National Institutional Ranking Framework (NIRF), established by the Ministry of Education, employs objective, evidence-based metrics to rank medical colleges across India. These include Teaching, Learning & Resources (TLR), Research and Professional Practice (RPC), Graduation Outcomes (GO), Outreach and Inclusivity (OI), and Peer Perception.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Encourages academic faculty development and student mentoring</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Fosters research output and high-impact medical journals</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Guides transparent educational choices for medical aspirants</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>Promotes lifelong learning in clinical preventive care</span>
          </div>
        </div>
      </div>

      {/* Action Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-rose-900 text-white shadow-md">
        <div className="space-y-1">
          <h4 className="font-bold text-base">Explore NIRF 2025 Ranked Colleges</h4>
          <p className="text-xs text-rose-100">Discover accredited medical universities and research centers across India.</p>
        </div>
        <Link
          to="/find-healthcare"
          className="px-5 py-2.5 bg-white text-rose-900 rounded-xl font-bold text-xs hover:bg-rose-50 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Explore Directory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
