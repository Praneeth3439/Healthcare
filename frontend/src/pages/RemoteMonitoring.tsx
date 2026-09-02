import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Plus,
  Activity,
  Heart,
  Droplets,
  Wind,
  Thermometer,
  Scale,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { HealthObservation } from '../types/monitoring';
import { getStoredObservations, saveHealthObservation } from '../services/api';
import { VitalsTrendChart } from '../components/VitalsTrendChart';
import { VitalsInputModal } from '../components/VitalsInputModal';
import { formatDateTime } from '../utils/formatters';
import { SEOHelmet } from '../components/SEOHelmet';

export const RemoteMonitoring: React.FC = () => {
  const [observations, setObservations] = useState<HealthObservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setObservations(getStoredObservations());
  }, []);

  const handleSaveObservation = async (obs: Omit<HealthObservation, 'id' | 'timestamp'>) => {
    const saved = await saveHealthObservation(obs);
    setObservations((prev) => [saved, ...prev]);
  };

  const handleDeleteObservation = (id: string) => {
    const updated = observations.filter((o) => o.id !== id);
    setObservations(updated);
    localStorage.setItem('healthcare_monitoring_observations', JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    if (observations.length === 0) return;
    const headers = ['ID', 'Timestamp', 'HeartRate_bpm', 'SystolicBP_mmHg', 'DiastolicBP_mmHg', 'BloodGlucose_mgdL', 'SpO2_pct', 'Temperature_F', 'Weight_kg', 'Category', 'Notes'];
    const rows = observations.map((o) => [
      o.id,
      o.timestamp,
      o.heartRate ?? '',
      o.systolicBp ?? '',
      o.diastolicBp ?? '',
      o.bloodGlucose ?? '',
      o.oxygenSaturation ?? '',
      o.temperature ?? '',
      o.weight ?? '',
      o.category ?? '',
      `"${(o.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `healthcare_vitals_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Latest observation for overview cards
  const latest = observations[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title="Remote Patient Monitoring Prototype"
        description="Observational vital telemetry tracking prototype for heart rate, blood pressure, glucose, and oxygen saturation."
      />

      {/* Prototype Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white p-5 md:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-teal-800/80 text-teal-300 flex-shrink-0">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Educational Prototype
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-800 text-teal-200">
                AHA / WHO Reference Ranges
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display">
              Remote Patient Monitoring
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Prototype/educational data unless connected to an approved medical device. Do not use for emergency triage.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all self-start md:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Vitals</span>
        </button>
      </div>

      {/* Latest Vitals Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Heart Rate */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Heart Rate</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.heartRate ? `${latest.heartRate}` : '—'}
            <span className="text-xs font-normal text-slate-500 ml-1">bpm</span>
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
            Target: 60–100
          </span>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Blood Pressure</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.systolicBp ? `${latest.systolicBp}/${latest.diastolicBp}` : '—'}
            <span className="text-xs font-normal text-slate-500 ml-1">mmHg</span>
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700">
            Target: &lt;120/80
          </span>
        </div>

        {/* Blood Glucose */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Glucose</span>
            <Droplets className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.bloodGlucose ? `${latest.bloodGlucose}` : '—'}
            <span className="text-xs font-normal text-slate-500 ml-1">mg/dL</span>
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700">
            Fasting: 70–99
          </span>
        </div>

        {/* SpO2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Oxygen (SpO2)</span>
            <Wind className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.oxygenSaturation ? `${latest.oxygenSaturation}%` : '—'}
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700">
            Target: 95–100%
          </span>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Temperature</span>
            <Thermometer className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.temperature ? `${latest.temperature}°F` : '—'}
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700">
            Target: 98.6°F
          </span>
        </div>

        {/* Weight */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Body Weight</span>
            <Scale className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-display">
            {latest?.weight ? `${latest.weight}` : '—'}
            <span className="text-xs font-normal text-slate-500 ml-1">kg</span>
          </p>
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
            Logged telemetry
          </span>
        </div>
      </div>

      {/* Interactive Longitudinal Recharts Component */}
      <VitalsTrendChart observations={observations} />

      {/* Observations Historical Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-700" />
              <span>Observation History Logs</span>
            </h3>
            <p className="text-xs text-slate-500">
              Total {observations.length} telemetry readings recorded in local / DynamoDB store
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={observations.length === 0}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reading</span>
            </button>
          </div>
        </div>

        {observations.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No telemetry records found. Log your first measurement above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Heart Rate</th>
                  <th className="py-3 px-4">Blood Pressure</th>
                  <th className="py-3 px-4">Glucose</th>
                  <th className="py-3 px-4">SpO2</th>
                  <th className="py-3 px-4">Temp</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {observations.map((obs) => (
                  <tr key={obs.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono">
                      {formatDateTime(obs.timestamp)}
                    </td>
                    <td className="py-3 px-4">{obs.heartRate ? `${obs.heartRate} bpm` : '—'}</td>
                    <td className="py-3 px-4">
                      {obs.systolicBp ? `${obs.systolicBp}/${obs.diastolicBp} mmHg` : '—'}
                    </td>
                    <td className="py-3 px-4">{obs.bloodGlucose ? `${obs.bloodGlucose} mg/dL` : '—'}</td>
                    <td className="py-3 px-4">{obs.oxygenSaturation ? `${obs.oxygenSaturation}%` : '—'}</td>
                    <td className="py-3 px-4">{obs.temperature ? `${obs.temperature}°F` : '—'}</td>
                    <td className="py-3 px-4">{obs.weight ? `${obs.weight} kg` : '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          obs.category === 'alert'
                            ? 'bg-rose-100 text-rose-800'
                            : obs.category === 'elevated'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {obs.category || 'normal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500">{obs.notes || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteObservation(obs.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <VitalsInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveObservation}
      />
    </div>
  );
};
