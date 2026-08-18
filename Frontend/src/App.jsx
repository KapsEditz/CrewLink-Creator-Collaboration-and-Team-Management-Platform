import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./components/home/home";
import Login from "./components/Pages/Login"; 
import Register from "./components/Pages/Register"; 

import DashboardLayout from "./components/Pages/DashBoard/DashboardLayout";
import Overview from "./components/Pages/DashBoard/overview";
import TalentDirectory from "./components/Pages/DashBoard/TalentDirectory";
import ProtectedRoute from "./components/Pages/ProtectedRoute";
import ProjectDetail from "./components/Pages/DashBoard/ProjectDetail";
import JobBoard from "./components/Pages/DashBoard/JobBoard";
import FreelancerProfile from "./components/Pages/DashBoard/FreelancerProfile";
import Settings from "./components/Pages/DashBoard/Settings";
import Projects from "./components/Pages/DashBoard/Projects";

function App() {
  const location = useLocation();

  return (
    <div className="app-container">
      
      <style>{`
        .page-transition {
          animation: pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          height: 100%;
        }
        @keyframes pageFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: 'var(--card-bg)', color: 'var(--text-main)', borderRadius: '12px', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }
        }} 
      />

      <div key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />

          {/* BASE PROTECTED ROUTES (Both Roles Can Access) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} /> 
              <Route path="settings" element={<Settings />} />
              <Route path="talent" element={<TalentDirectory />} />
              <Route path="profile/:id" element={<FreelancerProfile />} />
              
              {/* CREATOR ONLY ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['creator']} />}>
                <Route path="projects" element={<Projects />} />
                <Route path="project/:id" element={<ProjectDetail />} /> 
              </Route>

              {/* FREELANCER ONLY ROUTES */}
              <Route element={<ProtectedRoute allowedRoles={['freelancer']} />}>
                <Route path="jobs" element={<JobBoard />} />
              </Route>

            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;