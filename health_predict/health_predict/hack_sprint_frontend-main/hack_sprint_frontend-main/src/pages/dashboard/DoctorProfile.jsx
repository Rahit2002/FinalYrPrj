import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserMd, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaCamera,
  FaHeart,
  FaShieldAlt,
  FaHistory,
  FaBell,
  FaLock,
  FaTrash,
  FaUsers,
  FaAward,
  FaGraduationCap,
  FaCertificate,
  FaHospital,
  FaStethoscope,
  FaChartLine,
  FaClock,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    hospitalAffiliation: '',
    education: '',
    certifications: '',
    bio: '',
    consultationFee: '',
    availableHours: '',
    languages: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const [notifications, setNotifications] = useState({
    patientAlerts: true,
    criticalResults: true,
    appointmentUpdates: true,
    systemUpdates: false
  });

  const patientStats = {
    totalPatients: 145,
    activePatients: 89,
    highRiskPatients: 23,
    recentConsultations: 12
  };

  const recentActivity = [
    { id: 1, type: 'consultation', patient: 'John Smith', date: '2025-10-28', status: 'Completed' },
    { id: 2, type: 'report_review', patient: 'Emily Johnson', date: '2025-10-27', status: 'Reviewed' },
    { id: 3, type: 'prediction_alert', patient: 'Michael Brown', date: '2025-10-26', status: 'High Risk' }
  ];

  // Initialize profile data from user context
  useEffect(() => {
    if (user) {
      const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        specialization: user.specialization || '',
        licenseNumber: user.licenseNumber || '',
        yearsOfExperience: user.experience?.toString() || '',
        hospitalAffiliation: user.clinicAddress || '',
        education: user.qualification || '',
        certifications: user.qualification || '',
        bio: user.bio || '',
        consultationFee: user.consultationFee ? `$${user.consultationFee}` : '',
        availableHours: '9:00 AM - 5:00 PM', // Default since not in backend
        languages: 'English' // Default since not in backend
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    });
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    setUpdateError('');
    
    try {
      // Map frontend form data to backend expected format
      const updateData = {
        fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
        specialization: profileData.specialization,
        qualification: profileData.education,
        experience: parseInt(profileData.yearsOfExperience) || 0,
        phoneNumber: profileData.phone,
        clinicAddress: profileData.hospitalAffiliation,
        consultationFee: profileData.consultationFee.replace('$', ''),
        bio: profileData.bio
      };

      await updateProfile(updateData);
      setIsEditing(false);
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError('');
    // Reset form data to original user data
    if (user) {
      const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
      setProfileData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        specialization: user.specialization || '',
        licenseNumber: user.licenseNumber || '',
        yearsOfExperience: user.experience?.toString() || '',
        hospitalAffiliation: user.clinicAddress || '',
        education: user.qualification || '',
        certifications: user.qualification || '',
        bio: user.bio || '',
        consultationFee: user.consultationFee ? `$${user.consultationFee}` : '',
        availableHours: '9:00 AM - 5:00 PM',
        languages: 'English'
      });
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: FaUserMd },
    { id: 'professional', name: 'Professional', icon: FaStethoscope },
    { id: 'patients', name: 'Patient Overview', icon: FaUsers },
    { id: 'activity', name: 'Recent Activity', icon: FaHistory },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'security', name: 'Security', icon: FaLock }
  ];

  const specializations = [
    'Cardiology', 'Neurology', 'Ophthalmology', 'General Medicine', 
    'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                  <FaUserMd />
                </div>
                <button className="absolute bottom-0 right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                  <FaCamera className="text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.fullName || `${profileData.firstName} ${profileData.lastName}`.trim() || 'Doctor'}
                </h1>
                <p className="text-green-600 font-semibold flex items-center mt-1">
                  <FaStethoscope className="mr-2" />
                  {user?.specialization || profileData.specialization || 'General Medicine'} Specialist
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <p className="text-gray-600 flex items-center">
                    <FaShieldAlt className="mr-2 text-green-500" />
                    License: {user?.licenseNumber || profileData.licenseNumber || 'N/A'}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaAward className="mr-2 text-yellow-500" />
                    {user?.experience || profileData.yearsOfExperience || '0'} years experience
                  </p>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-300 ${
                isEditing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-green-600 text-white hover:shadow-lg'
              }`}
            >
              {isEditing ? (
                <>
                  <FaTimes className="mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  Edit Profile
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Settings</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-green-600 border-l-4 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <IconComponent className="mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-bold text-green-600">{patientStats.totalPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Patients</span>
                  <span className="font-bold text-green-600">{patientStats.activePatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Risk</span>
                  <span className="font-bold text-red-600">{patientStats.highRiskPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-bold text-purple-600">{patientStats.recentConsultations}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                    {isEditing && (
                      <button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className={`px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${
                          updateLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {updateLoading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Error Message */}
                  {updateError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      {updateError}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                      <input
                        type="text"
                        name="languages"
                        value={profileData.languages}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Hours</label>
                      <input
                        type="text"
                        name="availableHours"
                        value={profileData.availableHours}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Professional Information */}
              {activeTab === 'professional' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Professional Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                      <select
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {specializations.map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={profileData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="text"
                        name="yearsOfExperience"
                        value={profileData.yearsOfExperience}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Affiliation</label>
                      <input
                        type="text"
                        name="hospitalAffiliation"
                        value={profileData.hospitalAffiliation}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                      <input
                        type="text"
                        name="consultationFee"
                        value={profileData.consultationFee}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <textarea
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                    <textarea
                      name="certifications"
                      value={profileData.certifications}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Patient Overview */}
              {activeTab === 'patients' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Overview</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <FaUsers className="text-green-600 text-2xl" />
                        <span className="text-2xl font-bold text-green-600">{patientStats.totalPatients}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">Total Patients</h3>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <FaChartLine className="text-green-600 text-2xl" />
                        <span className="text-2xl font-bold text-green-600">{patientStats.activePatients}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">Active Patients</h3>
                    </div>
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <FaHeart className="text-red-600 text-2xl" />
                        <span className="text-2xl font-bold text-red-600">{patientStats.highRiskPatients}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">High Risk</h3>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <FaClock className="text-purple-600 text-2xl" />
                        <span className="text-2xl font-bold text-purple-600">{patientStats.recentConsultations}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">This Month</h3>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-4">Patient Distribution by Risk Level</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Low Risk</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-sm font-medium">87</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Medium Risk</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <span className="text-sm font-medium">35</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">High Risk</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div className="bg-red-500 h-2 rounded-full" style={{width: '16%'}}></div>
                          </div>
                          <span className="text-sm font-medium">23</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                            activity.type === 'consultation' ? 'bg-blue-100' :
                            activity.type === 'report_review' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {activity.type === 'consultation' ? <FaUserMd className="text-green-600" /> :
                             activity.type === 'report_review' ? <FaHeart className="text-green-600" /> :
                             <FaHeart className="text-red-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 capitalize">
                              {activity.type.replace('_', ' ')} - {activity.patient}
                            </h3>
                            <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          activity.status === 'Reviewed' ? 'bg-blue-100 text-green-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {key === 'patientAlerts' && 'Get notified about new patient activities'}
                            {key === 'criticalResults' && 'Immediate alerts for critical patient results'}
                            {key === 'appointmentUpdates' && 'Updates about appointment changes'}
                            {key === 'systemUpdates' && 'System maintenance and feature updates'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name={key}
                            checked={value}
                            onChange={handleNotificationChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Change Password</h3>
                      <p className="text-gray-600 mb-4">Update your password to keep your account secure</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Update Password
                      </button>
                    </div>
                    
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                      <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Enable 2FA
                      </button>
                    </div>
                    
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Session Management</h3>
                      <p className="text-gray-600 mb-4">Manage active sessions and device access</p>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                        View Sessions
                      </button>
                    </div>
                    
                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                      <p className="text-red-600 mb-4">Permanently delete your account and all associated data</p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
                        <FaTrash className="mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
