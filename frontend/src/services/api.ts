import { MedicalInstitution } from '../types/institution';
import { HealthObservation } from '../types/monitoring';
import { ScreeningResult, ScreeningInput } from '../types/screening';
import { UserProfile } from '../types/auth';
import rawInstitutions from '../data/nirf_data.json';
import { calculateHaversineDistance } from '../utils/geospatial';
import { evaluateEarlyHealthRisk } from '../utils/riskEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// In-memory / LocalStorage cache for standalone demonstration mode
const LOCAL_STORAGE_OBSERVATIONS_KEY = 'healthcare_monitoring_observations';
const LOCAL_STORAGE_SCREENING_KEY = 'healthcare_screening_history';
const LOCAL_STORAGE_SAVED_KEY = 'healthcare_saved_institutions';
const LOCAL_STORAGE_PROFILE_KEY = 'healthcare_user_profile';

export const institutionsData: MedicalInstitution[] = rawInstitutions as MedicalInstitution[];

/**
 * Fetch all institutions with optional filtering
 */
export async function fetchInstitutions(params?: {
  state?: string;
  city?: string;
  search?: string;
}): Promise<MedicalInstitution[]> {
  if (API_BASE_URL) {
    try {
      const url = new URL(`${API_BASE_URL}/institutions`);
      if (params?.state) url.searchParams.append('state', params.state);
      if (params?.city) url.searchParams.append('city', params.city);
      if (params?.search) url.searchParams.append('q', params.search);
      const res = await fetch(url.toString());
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway unavailable, falling back to bundled dataset:', e);
    }
  }

  // Fallback / Standalone mode
  let filtered = [...institutionsData];
  if (params?.state) {
    filtered = filtered.filter((i) => i.state.toLowerCase() === params.state!.toLowerCase());
  }
  if (params?.city) {
    filtered = filtered.filter((i) => i.city.toLowerCase() === params.city!.toLowerCase());
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q)
    );
  }
  return filtered;
}

/**
 * Fetch institution details by ID
 */
export async function fetchInstitutionById(id: string): Promise<MedicalInstitution | null> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/institutions/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway unavailable, falling back to bundled dataset:', e);
    }
  }

  const found = institutionsData.find((i) => i.id === id || String(i.nirf_rank) === id);
  return found || null;
}

/**
 * Find institutions nearby a given lat/long radius
 */
export async function fetchNearbyInstitutions(
  lat: number,
  lng: number,
  radiusKm = 200
): Promise<MedicalInstitution[]> {
  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/institutions/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway unavailable, computing client-side:', e);
    }
  }

  // Client-side geospatial calculation
  const withDistances = institutionsData
    .filter((i) => i.latitude !== null && i.longitude !== null)
    .map((inst) => {
      const dist = calculateHaversineDistance(
        { latitude: lat, longitude: lng },
        { latitude: inst.latitude!, longitude: inst.longitude! }
      );
      return { ...inst, distance_km: dist };
    })
    .filter((inst) => inst.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);

  return withDistances;
}

/**
 * Save Health Observation (Remote Patient Monitoring)
 */
export async function saveHealthObservation(observation: Omit<HealthObservation, 'id' | 'timestamp'>): Promise<HealthObservation> {
  const newObs: HealthObservation = {
    ...observation,
    id: `obs-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/monitoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObs),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway unavailable, persisting locally:', e);
    }
  }

  const existing = getStoredObservations();
  const updated = [newObs, ...existing];
  localStorage.setItem(LOCAL_STORAGE_OBSERVATIONS_KEY, JSON.stringify(updated));
  return newObs;
}

export function getStoredObservations(): HealthObservation[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_OBSERVATIONS_KEY);
    if (!raw) {
      // Default sample observations for demonstration
      const sampleObs: HealthObservation[] = [
        {
          id: 'obs-1',
          userId: 'usr-demo',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          heartRate: 72,
          systolicBp: 118,
          diastolicBp: 78,
          bloodGlucose: 92,
          temperature: 98.4,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          weight: 68.5,
          category: 'normal',
          notes: 'Routine morning vitals',
        },
        {
          id: 'obs-2',
          userId: 'usr-demo',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          heartRate: 76,
          systolicBp: 122,
          diastolicBp: 80,
          bloodGlucose: 98,
          temperature: 98.6,
          oxygenSaturation: 97,
          respiratoryRate: 17,
          weight: 68.4,
          category: 'normal',
          notes: 'Post-walk observation',
        },
        {
          id: 'obs-3',
          userId: 'usr-demo',
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
          heartRate: 80,
          systolicBp: 124,
          diastolicBp: 82,
          bloodGlucose: 104,
          temperature: 98.7,
          oxygenSaturation: 98,
          respiratoryRate: 16,
          weight: 68.6,
          category: 'elevated',
          notes: 'Slightly elevated glucose after lunch',
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_OBSERVATIONS_KEY, JSON.stringify(sampleObs));
      return sampleObs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Submit Early Health Risk Screening
 */
export async function submitHealthScreening(input: ScreeningInput): Promise<ScreeningResult> {
  const result = evaluateEarlyHealthRisk(input);

  if (API_BASE_URL) {
    try {
      const res = await fetch(`${API_BASE_URL}/screening`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, result }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API Gateway unavailable, persisting locally:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCREENING_KEY);
    const existing: ScreeningResult[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_STORAGE_SCREENING_KEY, JSON.stringify([result, ...existing]));
  } catch (e) {
    console.error('Failed to cache screening result locally', e);
  }

  return result;
}

export function getScreeningHistory(): ScreeningResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SCREENING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saved / Bookmarked institutions management
 */
export function getSavedInstitutionIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
    return raw ? JSON.parse(raw) : ['nirf-med-001', 'nirf-med-003'];
  } catch {
    return [];
  }
}

export function toggleSaveInstitution(id: string): string[] {
  const current = getSavedInstitutionIds();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter((x) => x !== id);
  } else {
    updated = [...current, id];
  }
  localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(updated));
  return updated;
}
