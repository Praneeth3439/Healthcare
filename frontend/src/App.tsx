import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SavedInstitutionsProvider } from './context/SavedInstitutionsContext';
import { RootLayout } from './layouts/RootLayout';
import { ProtectedRoute } from './layouts/ProtectedRoute';

import { Home } from './pages/Home';
import { FindHealthcare } from './pages/FindHealthcare';
import { InstitutionDetails } from './pages/InstitutionDetails';
import { RemoteMonitoring } from './pages/RemoteMonitoring';
import { HealthScreening } from './pages/HealthScreening';
import { SDG3 } from './pages/SDG3';
import { SDG4 } from './pages/SDG4';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <AuthProvider>
      <SavedInstitutionsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="find-healthcare" element={<FindHealthcare />} />
              <Route path="institution/:id" element={<InstitutionDetails />} />
              <Route path="remote-monitoring" element={<RemoteMonitoring />} />
              <Route path="health-screening" element={<HealthScreening />} />
              <Route path="sdg-3" element={<SDG3 />} />
              <Route path="sdg-4" element={<SDG4 />} />
              <Route path="about" element={<About />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </SavedInstitutionsProvider>
    </AuthProvider>
  );
}

export default App;
