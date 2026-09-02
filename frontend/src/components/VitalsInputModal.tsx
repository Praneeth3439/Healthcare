import React, { useState } from 'react';
import { X, Heart, Droplets, Thermometer, Wind, Scale, Activity, Plus } from 'lucide-react';
import { HealthObservation } from '../types/monitoring';
import { categorizeVital } from '../utils/formatters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obs: Omit<HealthObservation, 'id' | 'timestamp'>) => void;
}

export const VitalsInputModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [heartRate, setHeartRate] = useState<string>('');
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [diastolicBp, setDiastolicBp] = useState<string>('');
  const [bloodGlucose, setBloodGlucose] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [oxygenSaturation, setOxygenSaturation] = useState<string>('');
  const [respiratoryRate, setRespiratoryRate] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hr = heartRate ? parseFloat(heartRate) : undefined;
    const sBp = systolicBp ? parseFloat(systolicBp) : undefined;
    const dBp = diastolicBp ? parseFloat(diastolicBp) : undefined;
    const bg = bloodGlucose ? parseFloat(bloodGlucose) : undefined;
    const temp = temperature ? parseFloat(temperature) : undefined;
    const spo2 = oxygenSaturation ? parseFloat(oxygenSaturation) : undefined;
    const rr = respiratoryRate ? parseFloat(respiratoryRate) : undefined;
    const wt = weight ? parseFloat(weight) : undefined;

    // Determine category
    let category: HealthObservation['category'] = 'normal';
    if (
      (hr && categorizeVital('heartRate', hr) === 'alert') ||
      (sBp && categorizeVital('systolicBp', sBp) === 'alert') ||
      (dBp && categorizeVital('diastolicBp', dBp) === 'alert') ||
      (spo2 && categorizeVital('oxygenSaturation', spo2) === 'alert')
    ) {
      category = 'alert';
    } else if (
      (hr && categorizeVital('heartRate', hr) === 'elevated') ||
      (sBp && categorizeVital('systolicBp', sBp) === 'elevated') ||
      (bg && categorizeVital('bloodGlucose', bg) === 'elevated')
    ) {
      category = 'elevated';
    }

    onSave({
      userId: 'usr-current',
      heartRate: hr,
      systolicBp: sBp,
      diastolicBp: dBp,
      bloodGlucose: bg,
      temperature: temp,
      oxygenSaturation: spo2,
      respiratoryRate: rr,
      weight: wt,
      notes,
      category,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Record Health Observation</h3>
              <p className="text-xs text-slate-500">Enter physiological vital parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Heart Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                placeholder="e.g. 72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-400">Normal resting: 60–100 bpm</p>
            </div>

            {/* Blood Pressure Systolic / Diastolic */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600" />
                Blood Pressure (Systolic / Diastolic)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="60"
                  max="260"
                  placeholder="Sys 120"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  min="40"
                  max="160"
                  placeholder="Dia 80"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(e.target.value)}
                  className="w-1/2 px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">Normal: &lt;120 / &lt;80 mmHg</p>
            </div>

            {/* Blood Glucose */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-amber-500" />
                Blood Glucose (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="500"
                placeholder="e.g. 95"
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-400">Fasting: 70–99 mg/dL</p>
            </div>

            {/* Oxygen Saturation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-blue-500" />
                Oxygen Saturation (SpO2 %)
              </label>
              <input
                type="number"
                min="70"
                max="100"
                placeholder="e.g. 98"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-400">Normal: 95–100%</p>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-purple-500" />
                Body Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                min="90"
                max="110"
                placeholder="e.g. 98.6"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-400">Normal: 97.0–99.0 °F</p>
            </div>

            {/* Body Weight */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                placeholder="e.g. 70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-400">Metric weight</p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Observation Notes / Context</label>
            <textarea
              rows={2}
              placeholder="e.g. Fasting morning measurement, after 10 min rest..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md shadow-teal-700/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Save Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
