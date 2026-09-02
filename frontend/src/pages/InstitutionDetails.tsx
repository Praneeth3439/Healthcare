import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Award,
  Compass,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ShieldAlert,
  Building2,
  Navigation,
  Share2,
  Check,
} from 'lucide-react';
import { fetchInstitutionById, institutionsData } from '../services/api';
import { MedicalInstitution } from '../types/institution';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSavedInstitutions } from '../context/SavedInstitutionsContext';
import { calculateHaversineDistance, formatCoordinates } from '../utils/geospatial';
import { MapView } from '../components/MapView';
import { InstitutionCard } from '../components/InstitutionCard';
import { SEOHelmet } from '../components/SEOHelmet';

export const InstitutionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { location: userLocation } = useGeolocation();
  const { isSaved, toggleSave } = useSavedInstitutions();

  const [institution, setInstitution] = useState<MedicalInstitution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchInstitutionById(id).then((data) => {
        setInstitution(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-slate-600 font-medium">Loading institution profile...</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Institution Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested medical institution does not exist in the NIRF 2025 dataset.
        </p>
        <Link
          to="/find-healthcare"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl font-bold text-xs hover:bg-teal-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  // Calculate distance if coordinates exist
  let distanceKm: number | null = null;
  if (
    userLocation &&
    userLocation.latitude &&
    userLocation.longitude &&
    institution.latitude !== null &&
    institution.longitude !== null
  ) {
    distanceKm = calculateHaversineDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: institution.latitude, longitude: institution.longitude }
    );
  }

  const saved = isSaved(institution.id);

  // Find related institutions in same state
  const relatedInState = institutionsData
    .filter((i) => i.state === institution.state && i.id !== institution.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const googleMapsUrl =
    institution.latitude && institution.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${institution.latitude},${institution.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(institution.name + ' ' + institution.address)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title={`${institution.name} (NIRF 2025 Rank #${institution.nirf_rank})`}
        description={`Verified profile, NIRF 2025 ranking, address, and coordinates for ${institution.name} in ${institution.city}, ${institution.state}.`}
      />

      {/* Back Button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Healthcare Search</span>
        </button>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-teal-50 text-teal-900 border border-teal-200">
                <Award className="w-4 h-4 text-teal-600" />
                NIRF 2025 Rank #{institution.nirf_rank}
              </span>
              {institution.founded && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Founded in {institution.founded}
                </span>
              )}
              {distanceKm !== null && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  Approx. {distanceKm} km from your location
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 leading-tight">
              {institution.name}
            </h1>

            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>{institution.address}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={() => toggleSave(institution.id)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                saved
                  ? 'bg-teal-50 border-teal-200 text-teal-800 shadow-2xs'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {saved ? <BookmarkCheck className="w-4 h-4 text-teal-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? 'Saved' : 'Save Institution'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Share profile link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-left">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase text-slate-400">City / District</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{institution.city}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase text-slate-400">State / Territory</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{institution.state}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Geographic Coordinates</p>
            <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
              {formatCoordinates(institution.latitude, institution.longitude)}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[11px] font-semibold uppercase text-slate-400">Data Source</p>
            <p className="text-xs font-bold text-teal-800 mt-0.5">NIRF 2025 Medical</p>
          </div>
        </div>
      </div>

      {/* Map & Location Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-teal-600" />
              <span>Interactive Geospatial Location</span>
            </h3>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <MapView
            institutions={[institution]}
            selectedInstitution={institution}
            userLocation={userLocation}
            className="h-[380px]"
          />
        </div>

        {/* Dataset Transparency & Doctor Information Banner */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl p-6 bg-slate-900 text-white shadow-md space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="font-bold text-sm">Dataset Scope & Audit Note</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Doctor-level information and individual medical department rosters are not included in the official NIRF 2025 dataset.
            </p>
            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-white">Score Availability:</p>
              <p className="text-slate-400">Information not available in the NIRF 2025 dataset.</p>
            </div>
            <p className="text-[11px] text-slate-400">
              NIRF evaluates institutional excellence across teaching, learning resources, and research.
            </p>
          </div>
        </div>
      </div>

      {/* Related Institutions in the same State */}
      {relatedInState.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Other Ranked Institutions in {institution.state}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedInState.map((rel) => (
              <InstitutionCard key={rel.id} institution={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
