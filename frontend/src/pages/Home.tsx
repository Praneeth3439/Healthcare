import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  HeartPulse,
  ClipboardCheck,
  Award,
  ArrowRight,
  ShieldCheck,
  Globe2,
  GraduationCap,
  Sparkles,
  Building2,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { MapView } from '../components/MapView';
import { InstitutionCard } from '../components/InstitutionCard';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { SEOHelmet } from '../components/SEOHelmet';
import { institutionsData } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';

export const Home: React.FC = () => {
  const { location: userLocation } = useGeolocation();

  // Top 4 institutions for quick spotlight
  const spotlightInstitutions = institutionsData.slice(0, 4);

  // Verified stats from the NIRF 2025 dataset
  const totalInstitutions = institutionsData.length;
  const uniqueStates = new Set(institutionsData.map((i) => i.state)).size;
  const uniqueCities = new Set(institutionsData.map((i) => i.city)).size;
  const oldestYear = institutionsData.reduce((min, i) => {
    const yr = parseInt(i.founded || '9999', 10);
    return yr < min ? yr : min;
  }, 9999);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      <SEOHelmet
        title="Better Healthcare. Smarter Decisions."
        description="Discover highly ranked medical institutions, explore healthcare locations, monitor health vitals, and access responsible early health-risk screening."
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-teal-50/70 via-slate-50 to-white border-b border-slate-200/60">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>NIRF 2025 Medical Colleges & Telehealth Discovery</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Better Healthcare. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600">
                  Smarter Decisions.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover highly ranked medical institutions, explore healthcare locations, monitor health information, and access responsible early-risk screening tools.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/find-healthcare"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Find Healthcare</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/health-screening"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ClipboardCheck className="w-4 h-4 text-teal-600" />
                  <span>Start Health Screening</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200/80 text-left">
                <div>
                  <p className="text-2xl font-extrabold text-teal-800 font-display">#1</p>
                  <p className="text-xs text-slate-500 font-medium">AIIMS New Delhi</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800 font-display">{totalInstitutions}</p>
                  <p className="text-xs text-slate-500 font-medium">Ranked Medical Colleges</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-sky-700 font-display">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Geocoded Coordinates</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-6 bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Spotlight Institution
                      </h4>
                      <p className="text-xs font-bold text-teal-700">NIRF 2025 Ranked #1</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    Est. 1956
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-teal-300 font-semibold uppercase tracking-wider">
                      Premier Medical Center
                    </span>
                    <span className="text-xs text-teal-400 font-mono">New Delhi</span>
                  </div>
                  <h3 className="text-base font-bold leading-tight">
                    All India Institute of Medical Sciences (AIIMS)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Sri Aurobindo Marg, Ansari Nagar East, New Delhi, Delhi 110029
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-teal-800/80">
                    <span className="text-teal-300 font-mono">28.5650° N, 77.2100° E</span>
                    <Link
                      to="/institution/nirf-med-001"
                      className="font-bold text-white hover:text-teal-200 flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Micro Telemetry Widget */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                      <HeartPulse className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Remote Monitoring Telemetry</p>
                      <p className="text-[11px] text-slate-500">Continuous vital trend tracking</p>
                    </div>
                  </div>
                  <Link
                    to="/remote-monitoring"
                    className="text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL VERIFIED DATASET STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                NIRF 2025 Dataset at a Glance
              </h2>
              <p className="text-slate-400 text-sm">
                Verified statistics extracted directly from the official Ministry of Education NIRF 2025 medical rankings dataset.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-teal-400">
                  <Building2 className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-extrabold font-display">{totalInstitutions}</span>
                </div>
                <p className="text-xs font-semibold text-slate-300">Top Medical Institutions</p>
                <p className="text-[11px] text-slate-500">Ranks 1 through 50 continuous</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sky-400">
                  <Globe2 className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-extrabold font-display">{uniqueStates}</span>
                </div>
                <p className="text-xs font-semibold text-slate-300">States & Union Territories</p>
                <p className="text-[11px] text-slate-500">Pan-India representation</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400">
                  <MapPin className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-extrabold font-display">{uniqueCities}</span>
                </div>
                <p className="text-xs font-semibold text-slate-300">Unique Cities</p>
                <p className="text-[11px] text-slate-500">Metropolitan and regional centers</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Award className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-extrabold font-display">{oldestYear}</span>
                </div>
                <p className="text-xs font-semibold text-slate-300">Oldest Established (JIPMER)</p>
                <p className="text-[11px] text-slate-500">Rich heritage in medical education</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MAP PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
              <Compass className="w-4 h-4" />
              <span>Geospatial Healthcare Mapping</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Explore Medical Institutions Across India
            </h2>
            <p className="text-slate-600 text-sm">
              Locate top-ranked medical institutions, inspect coordinates, and calculate approximate distances.
            </p>
          </div>
          <Link
            to="/find-healthcare"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <span>Open Full Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Map Container */}
        <MapView
          institutions={institutionsData}
          selectedInstitution={null}
          userLocation={userLocation}
          className="h-[460px]"
        />
      </section>

      {/* 4. KEY FEATURE PILLARS (Remote Monitoring & Early Screening) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: Remote Monitoring */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-white to-teal-50/50 border border-teal-100 shadow-lg space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Observational Telemetry
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Remote Patient Monitoring Prototype
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Log and visualize vital measurements—including Heart Rate, Blood Pressure, Blood Glucose, SpO2, and Weight—with interactive trend graphs and physiological baseline alerts.
              </p>
            </div>
            <ul className="space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Continuous trend tracking with interactive Recharts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Standard physiological range validation (AHA/WHO)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Persistent user observation history
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/remote-monitoring"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-teal-950"
              >
                <span>Launch Remote Monitoring</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Early Health Screening */}
          <div className="rounded-3xl p-8 bg-gradient-to-br from-white to-sky-50/50 border border-sky-100 shadow-lg space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Preventive Health
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Early Health-Risk Screening
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Complete a guided, multi-step health assessment to evaluate lifestyle and symptom factors. Receive transparent, rule-based informational risk scores and guidance for seeking medical care.
              </p>
            </div>
            <ul className="space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Transparent, deterministic clinical risk algorithms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Contributing risk factor breakdown with explanations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Direct linkage to top NIRF medical institutions for care
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to="/health-screening"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-800 hover:text-sky-950"
              >
                <span>Start Health Screening</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP NIRF MEDICAL INSTITUTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Ministry of Education • NIRF 2025
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Top Ranked Medical Institutions
            </h2>
            <p className="text-slate-600 text-sm">
              Explore India’s premier medical colleges and research institutes based on NIRF 2025 rankings.
            </p>
          </div>
          <Link
            to="/find-healthcare"
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All 50 Institutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightInstitutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </section>

      {/* 6. SDG 3 & SDG 4 HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SDG 3 */}
          <Link
            to="/sdg-3"
            className="group rounded-2xl p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-md hover:shadow-xl transition-all border border-emerald-700/50 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-800 text-emerald-200">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
                UN Goal 3
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display group-hover:text-emerald-200 transition-colors">
                SDG 3 — Good Health & Well-Being
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Advancing universal health coverage, early disease awareness, and transparent access to quality medical institutions.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <span>Explore SDG 3 Commitments</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* SDG 4 */}
          <Link
            to="/sdg-4"
            className="group rounded-2xl p-6 bg-gradient-to-r from-rose-900 to-red-950 text-white shadow-md hover:shadow-xl transition-all border border-rose-800/50 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-800 text-rose-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold">
                UN Goal 4
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display group-hover:text-rose-200 transition-colors">
                SDG 4 — Quality Education
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fostering medical literacy, academic excellence in healthcare training, and preventive health awareness.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
              <span>Explore SDG 4 Commitments</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
            How HEALTHCARE Works
          </h2>
          <p className="text-slate-600 text-sm">
            Four streamlined steps connecting digital tools, verified rankings, and responsible health information.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-2xl font-extrabold text-teal-700 font-display">01</span>
            <h4 className="font-bold text-slate-900 text-base">Search & Geolocation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search by college name, city, state, or find institutions nearest to your GPS coordinates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-2xl font-extrabold text-teal-700 font-display">02</span>
            <h4 className="font-bold text-slate-900 text-base">Verified NIRF 2025 Data</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Access authentic institutional rankings, foundation years, and geocoded locations without fabrication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-2xl font-extrabold text-teal-700 font-display">03</span>
            <h4 className="font-bold text-slate-900 text-base">Log Health Telemetry</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record vitals such as blood pressure, glucose, and heart rate to observe longitudinal trends.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-2xl font-extrabold text-teal-700 font-display">04</span>
            <h4 className="font-bold text-slate-900 text-base">Early Risk Assessment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive transparent risk indications and discover highly ranked medical centers for clinical consultation.
            </p>
          </div>
        </div>
      </section>

      {/* 8. SECURITY, PRIVACY & MEDICAL DISCLAIMER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-3xl p-8 bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-teal-700 text-white flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">
                Privacy, Cloud Security & Integrity
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                Built on modern AWS Serverless architecture with Amazon Cognito authentication, DynamoDB isolation, and TLS encryption. User health observations are strictly minimized and never shared.
              </p>
            </div>
          </div>
          <Link
            to="/privacy"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs"
          >
            Read Privacy Policy
          </Link>
        </div>

        {/* Global Medical Disclaimer Card */}
        <MedicalDisclaimer />
      </section>
    </div>
  );
};
