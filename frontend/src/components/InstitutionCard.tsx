import React from 'react';
import { Link } from 'react-router-dom';
import { MedicalInstitution } from '../types/institution';
import { MapPin, Bookmark, BookmarkCheck, Award, ArrowUpRight, Calendar, Compass } from 'lucide-react';
import { useSavedInstitutions } from '../context/SavedInstitutionsContext';
import { formatCoordinates } from '../utils/geospatial';

interface Props {
  institution: MedicalInstitution;
  isSelected?: boolean;
  onSelectOnMap?: (inst: MedicalInstitution) => void;
}

export const InstitutionCard: React.FC<Props> = ({
  institution,
  isSelected = false,
  onSelectOnMap,
}) => {
  const { isSaved, toggleSave } = useSavedInstitutions();
  const saved = isSaved(institution.id);

  return (
    <div
      className={`group relative rounded-2xl p-5 transition-all duration-200 bg-white border ${
        isSelected
          ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
          : 'border-slate-200/80 hover:border-teal-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* NIRF Rank Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/60 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            NIRF Rank #{institution.nirf_rank}
          </span>
          {institution.distance_km !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
              <Compass className="w-3 h-3" />
              {institution.distance_km} km
            </span>
          )}
        </div>

        {/* Save/Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleSave(institution.id);
          }}
          className={`p-2 rounded-xl transition-colors ${
            saved
              ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              : 'bg-slate-100/70 text-slate-400 hover:text-teal-600 hover:bg-slate-200/70'
          }`}
          title={saved ? 'Remove from saved' : 'Save institution'}
          aria-label={saved ? 'Remove from saved' : 'Save institution'}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Institution Name */}
      <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors leading-snug line-clamp-2">
        <Link to={`/institution/${institution.id}`} className="hover:underline">
          {institution.name}
        </Link>
      </h3>

      {/* Location and Founded metadata */}
      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
          <span className="font-medium text-slate-800">{institution.city}, {institution.state}</span>
        </div>
        {institution.founded && (
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Established in {institution.founded}</span>
          </div>
        )}
      </div>

      {/* Coordinates pill */}
      <p className="mt-2.5 text-[11px] text-slate-400 font-mono">
        {formatCoordinates(institution.latitude, institution.longitude)}
      </p>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {onSelectOnMap && (
          <button
            type="button"
            onClick={() => onSelectOnMap(institution)}
            className="text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
          >
            Locate on Map
          </button>
        )}
        <Link
          to={`/institution/${institution.id}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:text-teal-900 transition-colors"
        >
          <span>Institution Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
