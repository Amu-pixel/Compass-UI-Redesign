import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { AuthProvider, RequireRole } from './context/AuthContext';
import './index.css';
import AssessmentPage from './pages/AssessmentPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import LecturerAssignmentsPage from './pages/LecturerAssignmentsPage';
import LearningPage from './pages/LearningPage';
import LoginPage from './pages/LoginPage';
import TrustPage from './pages/TrustPage';
import UnitPage from './pages/UnitPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/courses"
            element={
              <RequireRole role="student">
                <CoursesPage />
              </RequireRole>
            }
          />
          <Route
            path="/demo"
            element={
              <RequireRole role="student">
                <AppLayout />
              </RequireRole>
            }
          >
            <Route index element={<UnitPage />} />
            <Route path="learn" element={<LearningPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="trust" element={<TrustPage />} />
          </Route>
          <Route
            path="/lecturer"
            element={
              <RequireRole role="lecturer">
                <AppLayout />
              </RequireRole>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="assignments" element={<LecturerAssignmentsPage />} />
            <Route path="review" element={<DashboardPage initialTab="queue" />} />
            <Route path="knowledge" element={<KnowledgeBasePage />} />
            <Route path="trust" element={<TrustPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
