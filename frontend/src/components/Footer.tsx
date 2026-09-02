import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, ExternalLink, MapPin, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                HEALTHCARE
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Academic and research platform empowering patients, medical scholars, and citizens with verified NIRF 2025 medical institution discovery, geospatial search, telemetry vitals logging, and responsible early health screening.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-teal-400 font-medium">
              <span className="flex items-center gap-1 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800/60">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                NIRF 2025 Medical Colleges (50 Records)
              </span>
              <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AWS Serverless
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/find-healthcare" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Find Healthcare
                </Link>
              </li>
              <li>
                <Link to="/remote-monitoring" className="hover:text-teal-400 transition-colors">
                  Remote Monitoring
                </Link>
              </li>
              <li>
                <Link to="/health-screening" className="hover:text-teal-400 transition-colors">
                  Early Health Screening
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-teal-400 transition-colors">
                  Patient Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Global Goals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              UN Global Goals
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/sdg-3" className="hover:text-teal-400 transition-colors flex items-center justify-between group">
                  <span>SDG 3: Good Health</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400" />
                </Link>
              </li>
              <li>
                <Link to="/sdg-4" className="hover:text-teal-400 transition-colors flex items-center justify-between group">
                  <span>SDG 4: Quality Education</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy & Data Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Dataset & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              Data & Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by official Ministry of Education NIRF 2025 ranking data. Deployed with AWS Lambda, API Gateway, DynamoDB, Amazon Cognito, and CloudFront.
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Zero fabricated rankings or medical claims.</span>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="font-semibold text-white">Medical Disclaimer:</span>
              <span className="text-slate-300">
                This screening provides an informational risk assessment and does not constitute a medical diagnosis. Consult a qualified healthcare professional for diagnosis and treatment.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HEALTHCARE Platform. Built for Academic & Healthcare Discovery.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Terms of Use
            </Link>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Public Good
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
