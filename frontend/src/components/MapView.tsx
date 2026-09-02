import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MedicalInstitution, UserLocation } from '../types/institution';
import { MapPin, Navigation, ExternalLink, Award, Calendar } from 'lucide-react';

interface MapViewProps {
  institutions: MedicalInstitution[];
  selectedInstitution: MedicalInstitution | null;
  onSelectInstitution?: (institution: MedicalInstitution) => void;
  userLocation: UserLocation | null;
  className?: string;
}

// Custom Leaflet DivIcon generator for Medical Institutions
const createCustomMarkerIcon = (rank: number, isSelected: boolean) => {
  const bgColor = isSelected ? '#0d9488' : rank <= 5 ? '#0f766e' : rank <= 20 ? '#0284c7' : '#475569';
  const size = isSelected ? 36 : 28;

  return L.divIcon({
    className: 'custom-medical-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: ${size > 30 ? '12px' : '10px'};
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
      ">
        #${rank}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// User Location Pin
const userLocationIcon = L.divIcon({
  className: 'custom-user-pin',
  html: `
    <div style="
      background-color: #0284c7;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.8);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -6px;
        left: -6px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: rgba(2, 132, 199, 0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Component to handle map centering and smooth flyTo on selection
const MapController: React.FC<{
  selectedInstitution: MedicalInstitution | null;
  userLocation: UserLocation | null;
}> = ({ selectedInstitution, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedInstitution && selectedInstitution.latitude && selectedInstitution.longitude) {
      map.flyTo([selectedInstitution.latitude, selectedInstitution.longitude], 12, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else if (userLocation && userLocation.latitude && userLocation.longitude) {
      map.flyTo([userLocation.latitude, userLocation.longitude], 6, {
        duration: 1,
      });
    }
  }, [selectedInstitution, userLocation, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  institutions,
  selectedInstitution,
  onSelectInstitution,
  userLocation,
  className = 'h-[550px]',
}) => {
  // Center of India as initial viewport
  const defaultCenter: [number, number] = [21.7679, 78.8718];
  const defaultZoom = 5;

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 ${className}`}>
      <MapContainer
        center={
          userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : defaultCenter
        }
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedInstitution={selectedInstitution} userLocation={userLocation} />

        {/* User Current Location Marker */}
        {userLocation && (
          <>
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userLocationIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <p className="font-bold text-slate-800 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    Your Current Location
                  </p>
                  {userLocation.accuracy && (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Approximate accuracy: ±{Math.round(userLocation.accuracy)}m
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
            {userLocation.accuracy && userLocation.accuracy < 50000 && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={userLocation.accuracy}
                pathOptions={{ color: '#0284c7', fillColor: '#0284c7', fillOpacity: 0.1, weight: 1 }}
              />
            )}
          </>
        )}

        {/* Medical Institution Markers */}
        {institutions
          .filter((inst) => inst.latitude !== null && inst.longitude !== null)
          .map((inst) => {
            const isSelected = selectedInstitution?.id === inst.id;
            return (
              <Marker
                key={inst.id}
                position={[inst.latitude!, inst.longitude!]}
                icon={createCustomMarkerIcon(inst.nirf_rank, isSelected)}
                eventHandlers={{
                  click: () => {
                    if (onSelectInstitution) {
                      onSelectInstitution(inst);
                    }
                  },
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-2 max-w-xs text-left">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        <Award className="w-3 h-3" />
                        NIRF Rank #{inst.nirf_rank}
                      </span>
                      {inst.distance_km !== undefined && (
                        <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {inst.distance_km} km away
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs md:text-sm leading-snug line-clamp-2">
                      {inst.name}
                    </h4>

                    <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      {inst.city}, {inst.state}
                    </p>

                    {inst.founded && (
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Established {inst.founded}
                      </p>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/institution/${inst.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] text-slate-700 hidden sm:flex items-center gap-3">
        <span className="font-bold text-slate-900">Legend:</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-700" /> Top 5
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600" /> Rank 6–20
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Rank 21–50
        </span>
      </div>
    </div>
  );
};
