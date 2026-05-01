import React from 'react';
import { useAuth } from '../../services/AuthContext';
import NGODashboard from './NGODashboard';
import DonorDashboard from './DonorDashboard';
import VolunteerDashboard from './VolunteerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'NGO') return <NGODashboard />;
  if (user?.role === 'Volunteer') return <VolunteerDashboard />;
  
  return <DonorDashboard />;
}
