import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Compass,
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Navigation,
  Check,
} from 'lucide-react';
import { useInstitutions } from '../hooks/useInstitutions';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapView } from '../components/MapView';
import { InstitutionCard } from '../components/InstitutionCard';
import { SEOHelmet } from '../components/SEOHelmet';
import { MedicalInstitution } from '../types/institution';

export const FindHealthcare: React.FC = () => {
  const { location: userLocation, requestLocation, isLoading: isLocating, permissionGranted } = useGeolocation();
  const {
    institutions,
    states,
    cities,
    filters,
    setFilters,
    resetFilters,
    selectedInstitutionId,
    setSelectedInstitutionId,
    selectedInstitution,
    totalCount,
  } = useInstitutions(userLocation);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleSelectInstitution = (inst: MedicalInstitution) => {
    setSelectedInstitutionId(inst.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title="Find Healthcare & NIRF 2025 Medical Institutions"
        description="Search, filter, and discover top NIRF 2025 medical institutions in India with interactive geospatial maps and distance calculations."
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Find Healthcare Institutions
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Official NIRF 2025 Medical Colleges ranking database with interactive geospatial search.
          </p>
        </div>

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={requestLocation}
          disabled={isLocating}
          className={`self-start md:self-auto px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shadow-2xs ${
            permissionGranted
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : 'text-blue-600'}`} />
          <span>
            {isLocating
              ? 'Locating...'
              : permissionGranted
              ? 'Location Active (Calculating Distances)'
              : 'Use My Current Location'}
          </span>
          {permissionGranted && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </button>
      </div>

      {/* Main Grid: Filters & Search Left + Map Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Search & Filter Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-700" />
                <span>Search & Filter Options</span>
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-slate-500 hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Search Keywords</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Institution name, city, state..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* State Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">State / Union Territory</label>
              <select
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value, city: 'all' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="all">All States & UTs ({states.length})</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="all">All Cities ({cities.length})</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Rank Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Maximum NIRF Rank</span>
                <span className="text-teal-700 font-bold font-mono">Rank 1 to {filters.maxRank}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={filters.maxRank}
                onChange={(e) => setFilters({ ...filters, maxRank: parseInt(e.target.value, 10) })}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Top 5</span>
                <span>Top 25</span>
                <span>All 50</span>
              </div>
            </div>

            {/* Max Distance Slider (if user location is present) */}
            {userLocation && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    Max Distance
                  </span>
                  <span className="text-blue-700 font-bold font-mono">
                    {filters.maxDistanceKm ? `${filters.maxDistanceKm} km` : 'Any Distance'}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={filters.maxDistanceKm || 2000}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setFilters({ ...filters, maxDistanceKm: val >= 2000 ? null : val });
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50 km</span>
                  <span>500 km</span>
                  <span>Unlimited</span>
                </div>
              </div>
            )}

            {/* Sort Order */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700">Sort Results By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as 'rank' | 'distance' | 'founded' | 'name',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="rank">Highest NIRF Rank (1 to 50)</option>
                {userLocation && <option value="distance">Nearest Distance to Me</option>}
                <option value="founded">Year Established (Oldest First)</option>
                <option value="name">Alphabetical (A to Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Interactive Map Panel */}
        <div className="lg:col-span-8 space-y-4">
          <MapView
            institutions={institutions}
            selectedInstitution={selectedInstitution}
            onSelectInstitution={handleSelectInstitution}
            userLocation={userLocation}
            className="h-[460px] lg:h-[500px]"
          />
        </div>
      </div>

      {/* Synchronized Medical Institutions List */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Institutions ({totalCount} {totalCount === 1 ? 'Result' : 'Results'})
            </h2>
            <p className="text-xs text-slate-500">
              Click any card to inspect full details or view its geographic location on the map.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-teal-700">{totalCount}</span> of 50 colleges
          </div>
        </div>

        {institutions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No medical institutions matched your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your keyword, resetting the state or rank filter, or increasing the max distance radius.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold hover:bg-teal-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((inst) => (
              <InstitutionCard
                key={inst.id}
                institution={inst}
                isSelected={selectedInstitutionId === inst.id}
                onSelectOnMap={handleSelectInstitution}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
