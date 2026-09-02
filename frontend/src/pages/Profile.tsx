import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';
import { SEOHelmet } from '../components/SEOHelmet';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [userType, setUserType] = useState<UserRole>(user?.userType || 'Patient');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      phoneNumber,
      city,
      state,
      userType,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      profile: user,
      observations: JSON.parse(localStorage.getItem('healthcare_monitoring_observations') || '[]'),
      screenings: JSON.parse(localStorage.getItem('healthcare_screening_history') || '[]'),
      savedInstitutions: JSON.parse(localStorage.getItem('healthcare_saved_institutions') || '[]'),
      exportDate: new Date().toISOString(),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `healthcare_profile_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHelmet
        title="User Profile & Settings"
        description="Manage your HEALTHCARE account profile, regional location settings, and data export preferences."
      />

      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
          User Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your contact information, regional preferences, and account privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email (Cognito Login)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">City / District</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">State / Union Territory</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* User Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">User Classification</label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Patient">Patient</option>
                <option value="Student">Student (Medical / Academic)</option>
                <option value="Healthcare Professional">Healthcare Professional / Doctor</option>
                <option value="General User">General User / Researcher</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-700/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info & Export */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center gap-2 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-sm">Security & Cognito Session</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Auth Provider:</span>
                <span className="font-mono text-teal-300 font-semibold">Amazon Cognito</span>
              </p>
              <p className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Token Status:</span>
                <span className="text-emerald-400 font-semibold">Active JWT</span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-400">Created:</span>
                <span>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">Data Portability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your full user observation history, screening results, and saved medical centers in standardized JSON format.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="w-full py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export All My Data (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
