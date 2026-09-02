import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartPulse,
  ClipboardCheck,
  Bookmark,
  Building2,
  MapPin,
  Activity,
  ArrowRight,
  User,
  Plus,
  Compass,
  Clock,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedInstitutions } from '../context/SavedInstitutionsContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { getStoredObservations, getScreeningHistory, institutionsData } from '../services/api';
import { HealthObservation } from '../types/monitoring';
import { ScreeningResult } from '../types/screening';
import { InstitutionCard } from '../components/InstitutionCard';
import { formatDateTime } from '../utils/formatters';
import { SEOHelmet } from '../components/SEOHelmet';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { savedInstitutions } = useSavedInstitutions();
  const { location: userLocation } = useGeolocation();

  const [observations, setObservations] = useState<HealthObservation[]>([]);
  const [screenings, setScreenings] = useState<ScreeningResult[]>([]);

  useEffect(() => {
    setObservations(getStoredObservations());
    setScreenings(getScreeningHistory());
  }, []);

  const latestObs = observations[0] || null;
  const latestScreening = screenings[0] || null;

  // Nearby institutions (top 3)
  const nearbyInstitutions = institutionsData.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title="Patient & Provider Dashboard"
        description="Unified portal for vital telemetry, saved NIRF medical centers, and screening history."
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-700/80 border border-teal-500/30 flex items-center justify-center font-extrabold text-xl text-teal-200 uppercase shadow-md flex-shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-700 text-teal-200 uppercase tracking-wider">
                {user?.userType || 'Patient'}
              </span>
              <span className="text-xs text-teal-300 font-mono">
                {user?.city ? `${user.city}, ${user.state}` : 'New Delhi, India'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold">
              Welcome, {user?.fullName || 'Healthcare User'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Your personalized portal for remote health monitoring, risk screening, and medical center discovery.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <Link
            to="/remote-monitoring"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Vitals</span>
          </Link>
          <Link
            to="/health-screening"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
          >
            <ClipboardCheck className="w-4 h-4 text-teal-300" />
            <span>New Screening</span>
          </Link>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vitals Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Latest Vital Signs</h3>
            </div>
            <Link to="/remote-monitoring" className="text-xs font-bold text-teal-700 hover:underline">
              View History
            </Link>
          </div>

          {latestObs ? (
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Heart Rate</span>
                <p className="text-base font-bold text-slate-800">
                  {latestObs.heartRate ? `${latestObs.heartRate} bpm` : '—'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Blood Pressure</span>
                <p className="text-base font-bold text-slate-800">
                  {latestObs.systolicBp ? `${latestObs.systolicBp}/${latestObs.diastolicBp}` : '—'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Glucose</span>
                <p className="text-base font-bold text-slate-800">
                  {latestObs.bloodGlucose ? `${latestObs.bloodGlucose} mg/dL` : '—'}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Oxygen (SpO2)</span>
                <p className="text-base font-bold text-slate-800">
                  {latestObs.oxygenSaturation ? `${latestObs.oxygenSaturation}%` : '—'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No vital readings recorded yet.
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{latestObs ? `Recorded ${formatDateTime(latestObs.timestamp)}` : 'Prototype data'}</span>
            <span className="font-mono text-teal-700">AHA Norms</span>
          </div>
        </div>

        {/* Screening Assessment Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Health Risk Status</h3>
            </div>
            <Link to="/health-screening" className="text-xs font-bold text-teal-700 hover:underline">
              Retake Screening
            </Link>
          </div>

          {latestScreening ? (
            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Assessed Risk Level:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    latestScreening.overallRisk === 'Higher Risk'
                      ? 'bg-rose-100 text-rose-800'
                      : latestScreening.overallRisk === 'Moderate Risk'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {latestScreening.overallRisk}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Calculated Score:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {latestScreening.riskScore} / 100
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Body Mass Index:</span>
                <span className="font-bold text-slate-900">
                  {latestScreening.bmi} ({latestScreening.bmiCategory})
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 space-y-2">
              <p>No screening assessment completed yet.</p>
              <Link
                to="/health-screening"
                className="inline-block px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg font-bold text-[11px]"
              >
                Start Early Screening
              </Link>
            </div>
          )}

          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Informational risk evaluation</span>
            <span className="text-slate-500">Non-diagnostic</span>
          </div>
        </div>

        {/* Saved Institutions Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Bookmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Saved Medical Centers</h3>
            </div>
            <Link to="/find-healthcare" className="text-xs font-bold text-teal-700 hover:underline">
              Explore All
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-extrabold text-slate-900 font-display">
              {savedInstitutions.length}
              <span className="text-xs font-normal text-slate-500 ml-1.5">Colleges Bookmarked</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              Keep track of top-ranked institutions, research centers, and tertiary referral hospitals.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-2">
            <Link
              to="/find-healthcare"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <span>Search More Institutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Saved Institutions Showcase */}
      {savedInstitutions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Saved Medical Centers</h2>
              <p className="text-xs text-slate-500">Quick access to bookmarked NIRF 2025 institutions</p>
            </div>
            <Link to="/find-healthcare" className="text-xs font-bold text-teal-700 hover:underline">
              Directory
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedInstitutions.slice(0, 3).map((inst) => (
              <InstitutionCard key={inst.id} institution={inst} />
            ))}
          </div>
        </div>
      )}

      {/* Nearby Recommended NIRF Institutions */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top NIRF 2025 Medical Colleges</h2>
            <p className="text-xs text-slate-500">
              National Institutional Ranking Framework premier medical universities
            </p>
          </div>
          <Link to="/find-healthcare" className="text-xs font-bold text-teal-700 hover:underline">
            View All 50
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyInstitutions.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </div>
    </div>
  );
};
