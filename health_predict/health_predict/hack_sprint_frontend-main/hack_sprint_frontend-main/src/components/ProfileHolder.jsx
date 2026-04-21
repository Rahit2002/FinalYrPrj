import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PatientProfile from '../pages/dashboard/PatientProfile';
import DoctorProfile from '../pages/dashboard/DoctorProfile';

function ProfileHolder() {
  const { userType, user, refreshProfile, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Fetch fresh profile data when component mounts
    const fetchProfile = async () => {
      try {
        await refreshProfile();
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user && userType) {
      fetchProfile();
    } else {
      setProfileLoading(false);
    }
  }, [userType, user, refreshProfile]);

  // Show loading state
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!user || !userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load profile data. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  // Render appropriate profile component based on user type
  return userType === 'patient' ? <PatientProfile /> : <DoctorProfile />;
}

export default ProfileHolder;