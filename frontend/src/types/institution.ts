export interface MedicalInstitution {
  id: string;
  serial_no: number | null;
  name: string;
  nirf_rank: number;
  founded: string | null;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  has_coordinates: boolean;
  source: string;
  doctor_info_available: boolean;
  score: number | null;
  notes: string;
  distance_km?: number;
}

export interface InstitutionFilterState {
  searchQuery: string;
  state: string;
  city: string;
  minRank: number;
  maxRank: number;
  maxDistanceKm: number | null;
  sortBy: 'rank' | 'distance' | 'founded' | 'name';
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  state?: string;
}
