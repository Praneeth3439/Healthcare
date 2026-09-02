import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import { HealthObservation } from '../types/monitoring';
import { formatDateTime } from '../utils/formatters';
import { Heart, Droplets, Thermometer, Wind, Scale, Activity } from 'lucide-react';

interface Props {
  observations: HealthObservation[];
}

type MetricType = 'bp' | 'heartRate' | 'bloodGlucose' | 'oxygen' | 'temperature' | 'weight';

export const VitalsTrendChart: React.FC<Props> = ({ observations }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('heartRate');

  // Format data for Recharts (chronological order)
  const chartData = [...observations]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((obs) => ({
      timestamp: obs.timestamp,
      dateFormatted: formatDateTime(obs.timestamp),
      heartRate: obs.heartRate,
      systolicBp: obs.systolicBp,
      diastolicBp: obs.diastolicBp,
      bloodGlucose: obs.bloodGlucose,
      temperature: obs.temperature,
      oxygenSaturation: obs.oxygenSaturation,
      weight: obs.weight,
    }));

  const metricTabs = [
    { key: 'heartRate' as MetricType, label: 'Heart Rate', unit: 'bpm', icon: Heart, color: '#e11d48' },
    { key: 'bp' as MetricType, label: 'Blood Pressure', unit: 'mmHg', icon: Activity, color: '#0f766e' },
    { key: 'bloodGlucose' as MetricType, label: 'Blood Glucose', unit: 'mg/dL', icon: Droplets, color: '#d97706' },
    { key: 'oxygen' as MetricType, label: 'Oxygen (SpO2)', unit: '%', icon: Wind, color: '#0284c7' },
    { key: 'temperature' as MetricType, label: 'Temperature', unit: '°F', icon: Thermometer, color: '#7c3aed' },
    { key: 'weight' as MetricType, label: 'Body Weight', unit: 'kg', icon: Scale, color: '#475569' },
  ];

  const currentTab = metricTabs.find((t) => t.key === activeMetric)!;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <currentTab.icon className="w-5 h-5" style={{ color: currentTab.color }} />
            <span>Vital Signs Longitudinal Trends</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Observational telemetry data plotted across recorded timestamps
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {metricTabs.map((tab) => {
            const active = activeMetric === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveMetric(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No observations recorded yet. Click "Add Vital Reading" to begin.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="dateFormatted"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Heart Rate */}
              {activeMetric === 'heartRate' && (
                <>
                  <ReferenceArea y1={60} y2={100} fill="#14b8a6" fillOpacity={0.08} />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    name="Heart Rate (bpm)"
                    stroke="#e11d48"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#e11d48' }}
                    activeDot={{ r: 7 }}
                  />
                </>
              )}

              {/* Blood Pressure */}
              {activeMetric === 'bp' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="systolicBp"
                    name="Systolic (mmHg)"
                    stroke="#0f766e"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0f766e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolicBp"
                    name="Diastolic (mmHg)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#0284c7' }}
                  />
                </>
              )}

              {/* Blood Glucose */}
              {activeMetric === 'bloodGlucose' && (
                <>
                  <ReferenceArea y1={70} y2={99} fill="#14b8a6" fillOpacity={0.08} />
                  <Line
                    type="monotone"
                    dataKey="bloodGlucose"
                    name="Blood Glucose (mg/dL)"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#d97706' }}
                  />
                </>
              )}

              {/* Oxygen */}
              {activeMetric === 'oxygen' && (
                <>
                  <ReferenceArea y1={95} y2={100} fill="#14b8a6" fillOpacity={0.08} />
                  <Line
                    type="monotone"
                    dataKey="oxygenSaturation"
                    name="SpO2 (%)"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0284c7' }}
                  />
                </>
              )}

              {/* Temperature */}
              {activeMetric === 'temperature' && (
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature (°F)"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#7c3aed' }}
                />
              )}

              {/* Weight */}
              {activeMetric === 'weight' && (
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#475569"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#475569' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          Shaded areas indicate standard physiological baseline ranges
        </span>
        <span className="text-slate-400 font-mono">Telemetry prototype</span>
      </div>
    </div>
  );
};
