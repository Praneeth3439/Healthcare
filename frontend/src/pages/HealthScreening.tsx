import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  ShieldAlert,
  Activity,
  Heart,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building2,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { ScreeningInput, ScreeningResult } from '../types/screening';
import { submitHealthScreening, institutionsData } from '../services/api';
import { MedicalDisclaimer } from '../components/MedicalDisclaimer';
import { InstitutionCard } from '../components/InstitutionCard';
import { SEOHelmet } from '../components/SEOHelmet';

const commonSymptoms = [
  'Chest tightness or discomfort',
  'Shortness of breath on mild exertion',
  'Dizziness or lightheadedness',
  'Unexplained chronic fatigue',
  'Heart palpitations / racing pulse',
  'Swelling in ankles or legs (edema)',
  'Frequent excessive thirst or urination',
  'Persistent morning headaches',
];

export const HealthScreening: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);

  // Form State
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');
  const [smokingStatus, setSmokingStatus] = useState<'never' | 'former' | 'current'>('never');
  const [alcoholIntake, setAlcoholIntake] = useState<'none' | 'occasional' | 'regular'>('occasional');

  const [hasHypertensionHistory, setHasHypertensionHistory] = useState<boolean>(false);
  const [hasDiabetesHistory, setHasDiabetesHistory] = useState<boolean>(false);
  const [hasFamilyHeartDisease, setHasFamilyHeartDisease] = useState<boolean>(false);
  const [systolicBp, setSystolicBp] = useState<string>('');
  const [fastingGlucose, setFastingGlucose] = useState<string>('');

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [durationWeeks, setDurationWeeks] = useState<number>(1);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const inputData: ScreeningInput = {
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      smokingStatus,
      alcoholIntake,
      hasHypertensionHistory,
      hasDiabetesHistory,
      hasFamilyHeartDisease,
      systolicBp: systolicBp ? parseFloat(systolicBp) : undefined,
      fastingGlucose: fastingGlucose ? parseFloat(fastingGlucose) : undefined,
      symptoms: selectedSymptoms,
      durationWeeks,
    };

    const res = await submitHealthScreening(inputData);
    setResult(res);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setResult(null);
    setCurrentStep(1);
    setSelectedSymptoms([]);
    setSystolicBp('');
    setFastingGlucose('');
  };

  // Recommended institutions from NIRF 2025
  const recommendedColleges = institutionsData.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title="Early Health-Risk Screening"
        description="Complete a responsible, rule-based informational early health-risk screening assessment and discover top medical institutions."
      />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold">
          <ClipboardCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Informational Early Risk Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
          Early Health-Risk Screening
        </h1>
        <p className="text-sm text-slate-600">
          Answer questions regarding your demographics, health observations, and lifestyle factors to generate an educational risk assessment.
        </p>
      </div>

      {/* Mandatory Medical Notice */}
      <MedicalDisclaimer variant="card" />

      {/* Result Display State */}
      {result ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-8 animate-in fade-in duration-200">
          {/* Risk Level Badge & Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assessment Outcome
              </span>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-base font-extrabold shadow-xs ${
                    result.overallRisk === 'Higher Risk'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : result.overallRisk === 'Moderate Risk'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {result.overallRisk}
                </span>
                <span className="text-xs text-slate-500 font-medium font-mono">
                  Calculated Risk Score: {result.riskScore} / 100
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="font-semibold text-slate-400 uppercase text-[10px]">Body Mass Index</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {result.bmi} <span className="text-xs font-medium text-slate-500">({result.bmiCategory})</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="font-semibold text-slate-400 uppercase text-[10px]">Reported Symptoms</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {selectedSymptoms.length} <span className="text-xs font-medium text-slate-500">Factors</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <p className="font-semibold text-slate-400 uppercase text-[10px]">Clinical Model</p>
              <p className="text-xs font-bold text-teal-800 mt-1">Deterministic Rule-Engine</p>
            </div>
          </div>

          {/* Contributing Factors Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Contributing Risk Factors</h3>
            {result.contributingFactors.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No significant elevated risk factors identified.</p>
            ) : (
              <div className="space-y-2.5">
                {result.contributingFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{factor.factor}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{factor.description}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap ${
                        factor.severity === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : factor.severity === 'moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {factor.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actionable Health Guidance */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900">Healthcare-Seeking Guidance</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Highly Ranked NIRF Medical Institutions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recommended Medical Centers (NIRF 2025)
                </h3>
                <p className="text-xs text-slate-500">
                  Highly ranked institutions based on NIRF 2025. Consult a physician for diagnosis.
                </p>
              </div>
              <Link
                to="/find-healthcare"
                className="text-xs font-bold text-teal-700 hover:text-teal-900"
              >
                View all centers
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedColleges.map((col) => (
                <InstitutionCard key={col.id} institution={col} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-step Form Wizard */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Step Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                {currentStep}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {currentStep === 1 && 'Step 1: Demographics & Lifestyle'}
                {currentStep === 2 && 'Step 2: Clinical Observations & History'}
                {currentStep === 3 && 'Step 3: Reported Symptoms'}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-400">Step {currentStep} of 3</span>
          </div>

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Biological Sex</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Height (cm)</label>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 160)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Weight (kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 60)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Physical Activity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Physical Activity Level</label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="sedentary">Sedentary (Little or no exercise)</option>
                    <option value="light">Light (1–2 days / week)</option>
                    <option value="moderate">Moderate (3–5 days / week)</option>
                    <option value="active">Active / Daily intense activity</option>
                  </select>
                </div>

                {/* Smoking */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Tobacco / Smoking Status</label>
                  <select
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="never">Never smoked</option>
                    <option value="former">Former smoker</option>
                    <option value="current">Current smoker / tobacco user</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Next: Medical History</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Personal & Family History
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasHypertensionHistory}
                      onChange={(e) => setHasHypertensionHistory(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      I have been diagnosed with high blood pressure (hypertension)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDiabetesHistory}
                      onChange={(e) => setHasDiabetesHistory(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      I have been diagnosed with type 1 or type 2 diabetes / high blood sugar
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFamilyHeartDisease}
                      onChange={(e) => setHasFamilyHeartDisease(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Immediate family member had premature cardiovascular illness (before age 55)
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Recent Systolic BP (mmHg, optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={systolicBp}
                    onChange={(e) => setSystolicBp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Fasting Blood Glucose (mg/dL, optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 95"
                    value={fastingGlucose}
                    onChange={(e) => setFastingGlucose(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>Next: Current Symptoms</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select any symptoms experienced recently
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {commonSymptoms.map((sym) => {
                    const isChecked = selectedSymptoms.includes(sym);
                    return (
                      <label
                        key={sym}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          isChecked
                            ? 'border-teal-500 bg-teal-50/60 font-semibold text-teal-900'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSymptom(sym)}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-xs">{sym}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Calculate Risk Assessment'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
