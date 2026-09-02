import React from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  ShieldCheck,
  Award,
  Compass,
  Cpu,
  Layers,
  Database,
  Globe2,
  GraduationCap,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { SEOHelmet } from '../components/SEOHelmet';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEOHelmet
        title="About HEALTHCARE"
        description="Learn about the HEALTHCARE academic and discovery platform, its serverless cloud architecture, NIRF 2025 dataset integrity, and geospatial search."
      />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span>Academic & Healthcare Discovery Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900">
          About HEALTHCARE
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          A modern digital healthcare discovery and early screening platform bridging authentic medical institutional rankings, geospatial location mapping, and telemetry vitals logging.
        </p>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            The Problem
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Healthcare Information Fragmentation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Finding verified tertiary healthcare institutions and understanding institutional accreditation is often hindered by commercial advertising, unverified reviews, and lack of geospatial integration. Moreover, individuals lack transparent tools to monitor their vitals over time and understand baseline risk indicators.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-teal-200 bg-gradient-to-br from-white to-teal-50/50 shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            The Solution
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Transparent Discovery & Responsible Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            HEALTHCARE brings official Ministry of Education NIRF 2025 rankings together with an interactive Leaflet map, Haversine distance calculations, a telemetry observation logger, and deterministic rule-based early health risk assessments without commercial bias.
          </p>
        </div>
      </div>

      {/* Dataset & Data Integrity */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-teal-800 text-teal-300">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">NIRF 2025 Dataset & Integrity Principles</h3>
            <p className="text-xs text-slate-400">Zero fabrication commitment</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The application utilizes the authentic NIRF 2025 Medical Category ranking dataset comprising 50 premier medical institutions across India. All data fields—including rankings, names, established years, cities, states, and coordinates—reflect verified data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
            <p className="font-bold text-teal-400">No Fabricated Doctors</p>
            <p className="text-slate-400 text-[11px]">Doctor-level records are explicitly noted as not present in the dataset.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
            <p className="font-bold text-teal-400">100% Geocoded</p>
            <p className="text-slate-400 text-[11px]">All 50 institutions possess verified decimal coordinates across India.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
            <p className="font-bold text-teal-400">Auditable Schema</p>
            <p className="text-slate-400 text-[11px]">Processed cleanly with Python and documented in dataset specifications.</p>
          </div>
        </div>
      </div>

      {/* Architecture & Serverless Stack */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Cloud Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            AWS Serverless & Frontend Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800 w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Frontend Layer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              React 18, TypeScript, Vite, Tailwind CSS, React-Leaflet, and Recharts. Hosted on Amazon S3 with CloudFront CDN distribution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800 w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Serverless Compute</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AWS Lambda with Python 3.10 runtime triggered via Amazon API Gateway HTTP APIs with fine-grained IAM execution roles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 w-fit">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Data Persistence</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Amazon DynamoDB for low-latency storage of user profiles, health observations, and saved institutions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Auth & Monitoring</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Amazon Cognito User Pools for secure user management, and Amazon CloudWatch for metrics, logging, and alarms.
            </p>
          </div>
        </div>
      </div>

      {/* Limitations Section */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          <h3>System Limitations & Disclaimers</h3>
        </div>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <li>
            • <strong>Non-Diagnostic Nature:</strong> The Early Health-Risk Screening feature provides informational risk estimations based on user-entered parameters and does NOT constitute a clinical diagnosis.
          </li>
          <li>
            • <strong>Prototype Monitoring:</strong> Remote patient monitoring is an educational prototype and does not replace certified, approved medical devices or hospital ICU telemetry.
          </li>
          <li>
            • <strong>NIRF Scope:</strong> NIRF ranks reflect broad institutional academic and research excellence, not immediate emergency triage or individual doctor expertise.
          </li>
          <li>
            • <strong>Geospatial Approximation:</strong> Distances are calculated via mathematical Haversine spherical formula and represent straight-line geodesic distance rather than exact road travel routes.
          </li>
        </ul>
      </div>
    </div>
  );
};
