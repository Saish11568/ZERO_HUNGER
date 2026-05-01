import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Import layout wrapper
import Sidebar from './components/Sidebar';
import Header from './components/Header'; // We will create this

// Import pages
import Dashboard from './pages/Dashboard'; // Automatically uses index.jsx
import ListFood from './pages/ListFood';
import Alerts from './pages/Alerts';
import IncomingDeliveries from './pages/IncomingDeliveries';
import Login from './pages/Login';
import Settings from './pages/Settings'; // We will create this
import LandingPage from './pages/LandingPage';

function MainLayout({ children }) {
  return (
    <div className="flex bg-[#F8F6F0] dark:bg-slate-950 min-h-screen text-on-background font-body-md">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[240px] w-[calc(100%-240px)] h-screen overflow-y-auto bg-surface">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

import Donations from './pages/Donations';
import AnimalFeeding from './pages/AnimalFeeding';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in MainLayout */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/ngo-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/list-food" element={<MainLayout><ListFood /></MainLayout>} />
            <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
            <Route path="/donations" element={<MainLayout><Donations /></MainLayout>} />
            <Route path="/deliveries" element={<MainLayout><IncomingDeliveries /></MainLayout>} />
            <Route path="/animal-feeding" element={<MainLayout><AnimalFeeding /></MainLayout>} />
            <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
