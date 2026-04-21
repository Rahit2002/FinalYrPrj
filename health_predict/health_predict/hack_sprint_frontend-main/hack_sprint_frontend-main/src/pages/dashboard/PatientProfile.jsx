import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
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
  FaEye,
  FaDownload,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const PatientProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    medicalHistory: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const [notifications, setNotifications] = useState({
    emailReports: true,
    smsAlerts: false,
    predictionUpdates: true,
    appointmentReminders: true
  });

  const recentReports = [
    { id: 1, name: 'Blood Test Results', date: '2025-10-28', status: 'Analyzed' },
    { id: 2, name: 'ECG Report', date: '2025-10-25', status: 'Analyzed' },
    { id: 3, name: 'Chest X-Ray', date: '2025-10-20', status: 'Processing' }
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
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        emergencyContact: user.emergencyContactNumber || '',
        bloodType: user.bloodGroup || '',
        allergies: user.allergies || '',
        medicalHistory: user.medicalHistory || ''
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
        phoneNumber: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        emergencyContactNumber: profileData.emergencyContact,
        bloodGroup: profileData.bloodType,
        allergies: profileData.allergies,
        medicalHistory: profileData.medicalHistory
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
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || '',
        emergencyContact: user.emergencyContactNumber || '',
        bloodType: user.bloodGroup || '',
        allergies: user.allergies || '',
        medicalHistory: user.medicalHistory || ''
      });
    }
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: FaUser },
    // { id: 'medical', name: 'Medical Info', icon: FaHeart },
    // { id: 'reports', name: 'Reports History', icon: FaHistory },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'security', name: 'Security', icon: FaLock }
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
                <div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                  <FaCamera className="text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.fullName || `${profileData.firstName} ${profileData.lastName}`.trim() || 'User'}
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <FaShieldAlt className="mr-2 text-green-500" />
                  Patient ID: P{user?.id?.slice(-6) || '000000'}
                </p>
                <p className="text-gray-600">{user?.email || profileData.email}</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-300 ${
                isEditing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-pink-600 text-white hover:shadow-lg'
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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
                          ? 'bg-blue-50 text-pink-600 border-l-4 border-blue-600'
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
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
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
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
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
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
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
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={profileData.gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Medical Information */}
              {activeTab === 'medical' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                      <input
                        type="text"
                        name="bloodType"
                        value={profileData.bloodType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-lg ${
                          isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                    <textarea
                      name="allergies"
                      value={profileData.allergies}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="List any known allergies..."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={profileData.medicalHistory}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-lg ${
                        isEditing ? 'border-gray-300 focus:ring-2 focus:ring-pink-500' : 'border-gray-200 bg-gray-50'
                      }`}
                      placeholder="Describe your medical history..."
                    />
                  </div>
                </div>
              )}

              {/* Reports History */}
              {activeTab === 'reports' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports History</h2>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <FaHeart className="text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{report.name}</h3>
                            <p className="text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            report.status === 'Analyzed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {report.status}
                          </span>
                          <button className="text-pink-600 hover:text-blue-700">
                            <FaEye />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700">
                            <FaDownload />
                          </button>
                        </div>
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
                            {key === 'emailReports' && 'Receive analysis results via email'}
                            {key === 'smsAlerts' && 'Get SMS alerts for urgent health notifications'}
                            {key === 'predictionUpdates' && 'Notifications about new health predictions'}
                            {key === 'appointmentReminders' && 'Reminders for upcoming appointments'}
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
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
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
                      <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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

export default PatientProfile;
