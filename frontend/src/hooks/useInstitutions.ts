import { useState, useMemo } from 'react';
import { MedicalInstitution, InstitutionFilterState, UserLocation } from '../types/institution';
import { institutionsData } from '../services/api';
import { calculateHaversineDistance } from '../utils/geospatial';

const initialFilterState: InstitutionFilterState = {
  searchQuery: '',
  state: 'all',
  city: 'all',
  minRank: 1,
  maxRank: 50,
  maxDistanceKm: null,
  sortBy: 'rank',
};

export function useInstitutions(userLocation: UserLocation | null) {
  const [filters, setFilters] = useState<InstitutionFilterState>(initialFilterState);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);

  // Derive unique states and cities from actual data
  const states = useMemo(() => {
    const set = new Set<string>();
    institutionsData.forEach((i) => {
      if (i.state) set.add(i.state);
    });
    return Array.from(set).sort();
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    institutionsData.forEach((i) => {
      if (filters.state !== 'all' && i.state.toLowerCase() !== filters.state.toLowerCase()) {
        return;
      }
      if (i.city) set.add(i.city);
    });
    return Array.from(set).sort();
  }, [filters.state]);

  // Compute filtered & sorted list with distances
  const institutions = useMemo(() => {
    return institutionsData
      .map((inst) => {
        let distance: number | undefined = undefined;
        if (
          userLocation &&
          userLocation.latitude &&
          userLocation.longitude &&
          inst.latitude !== null &&
          inst.longitude !== null
        ) {
          distance = calculateHaversineDistance(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: inst.latitude, longitude: inst.longitude }
          );
        }
        return { ...inst, distance_km: distance };
      })
      .filter((inst) => {
        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesName = inst.name.toLowerCase().includes(q);
          const matchesCity = inst.city.toLowerCase().includes(q);
          const matchesState = inst.state.toLowerCase().includes(q);
          const matchesAddress = inst.address.toLowerCase().includes(q);
          if (!matchesName && !matchesCity && !matchesState && !matchesAddress) {
            return false;
          }
        }

        // State filter
        if (filters.state !== 'all') {
          if (inst.state.toLowerCase() !== filters.state.toLowerCase()) return false;
        }

        // City filter
        if (filters.city !== 'all') {
          if (inst.city.toLowerCase() !== filters.city.toLowerCase()) return false;
        }

        // Rank filter
        if (inst.nirf_rank < filters.minRank || inst.nirf_rank > filters.maxRank) {
          return false;
        }

        // Distance filter
        if (filters.maxDistanceKm !== null && inst.distance_km !== undefined) {
          if (inst.distance_km > filters.maxDistanceKm) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rank') {
          return a.nirf_rank - b.nirf_rank;
        }
        if (filters.sortBy === 'distance') {
          if (a.distance_km === undefined) return 1;
          if (b.distance_km === undefined) return -1;
          return a.distance_km - b.distance_km;
        }
        if (filters.sortBy === 'founded') {
          const fa = parseInt(a.founded || '9999', 10);
          const fb = parseInt(b.founded || '9999', 10);
          return fa - fb;
        }
        if (filters.sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return a.nirf_rank - b.nirf_rank;
      });
  }, [filters, userLocation]);

  const selectedInstitution = useMemo(() => {
    if (!selectedInstitutionId) return null;
    return institutions.find((i) => i.id === selectedInstitutionId) || null;
  }, [institutions, selectedInstitutionId]);

  const resetFilters = () => setFilters(initialFilterState);

  return {
    institutions,
    states,
    cities,
    filters,
    setFilters,
    resetFilters,
    selectedInstitutionId,
    setSelectedInstitutionId,
    selectedInstitution,
    totalCount: institutions.length,
  };
}
