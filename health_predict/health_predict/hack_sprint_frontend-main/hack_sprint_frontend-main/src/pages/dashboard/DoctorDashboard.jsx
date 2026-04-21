import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserMd, 
  FaHeart, 
  FaBrain, 
  FaEye, 
  FaLungs, 
  FaUsers,
  FaFileMedical,
  FaSearch,
  FaFilter,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDownload,
  FaCalendar,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import DoctorBookings from '../../components/bookings/DoctorBookings';
import DoctorPatients from '../../components/reports/DoctorPatients';
import api from '../../utils/api';

const DoctorDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiology');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [doctorPatients, setDoctorPatients] = useState([]);

  // Mock data for doctor's patients by specialty
  const patientsBySpecialty = {
    'Cardiology': [
      {
        id: 1,
        name: 'Sarah Johnson',
        age: 45,
        gender: 'Female',
        phone: '+1 (555) 123-4567',
        email: 'sarah.j@email.com',
        lastReport: '2025-10-28',
        riskLevel: 'High',
        predictions: [
          { disease: 'Coronary Artery Disease', probability: '78%', riskLevel: 'High' },
          { disease: 'Hypertension', probability: '85%', riskLevel: 'High' }
        ],
        reports: [
          { name: 'ECG_Report_2025.pdf', date: '2025-10-28', type: 'ECG' },
          { name: 'Blood_Test_Cardiac.pdf', date: '2025-10-25', type: 'Blood Test' }
        ]
      },
      {
        id: 2,
        name: 'Michael Chen',
        age: 62,
        gender: 'Male',
        phone: '+1 (555) 987-6543',
        email: 'michael.c@email.com',
        lastReport: '2025-10-26',
        riskLevel: 'Medium',
        predictions: [
          { disease: 'Atrial Fibrillation', probability: '45%', riskLevel: 'Medium' }
        ],
        reports: [
          { name: 'Holter_Monitor_Report.pdf', date: '2025-10-26', type: 'Holter Monitor' }
        ]
      }
    ],
    'Neurology': [
      {
        id: 3,
        name: 'Emily Rodriguez',
        age: 38,
        gender: 'Female',
        phone: '+1 (555) 456-7890',
        email: 'emily.r@email.com',
        lastReport: '2025-10-27',
        riskLevel: 'Medium',
        predictions: [
          { disease: 'Multiple Sclerosis', probability: '55%', riskLevel: 'Medium' }
        ],
        reports: [
          { name: 'MRI_Brain_Scan.pdf', date: '2025-10-27', type: 'MRI' }
        ]
      }
    ],
    'Ophthalmology': [
      {
        id: 4,
        name: 'James Wilson',
        age: 55,
        gender: 'Male',
        phone: '+1 (555) 321-0987',
        email: 'james.w@email.com',
        lastReport: '2025-10-25',
        riskLevel: 'Low',
        predictions: [
          { disease: 'Diabetic Retinopathy', probability: '30%', riskLevel: 'Low' }
        ],
        reports: [
          { name: 'Retinal_Scan_2025.pdf', date: '2025-10-25', type: 'Retinal Scan' }
        ]
      }
    ]
  };

  // Fetch doctor profile and patients data
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!isAuthenticated || !user || authLoading) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch doctor profile
        const profileResponse = await api.get('/doctor/profile');
        if (profileResponse.data && profileResponse.data.data) {
          const profile = profileResponse.data.data;
          setDoctorProfile(profile);
          
          // Set specialty based on doctor's actual specialization
          if (profile.specialization) {
            setSelectedSpecialty(profile.specialization);
          }
        }

        // Fetch doctor's patients through bookings (when endpoint exists)
        try {
          const bookingsResponse = await api.get(`/booking/doctor/${user.id}`);
          if (bookingsResponse.data && bookingsResponse.data.data) {
            // Extract unique patients from bookings
            const patientsMap = new Map();
            bookingsResponse.data.data.forEach(booking => {
              if (!patientsMap.has(booking.patientId)) {
                patientsMap.set(booking.patientId, {
                  id: booking.patientId,
                  name: booking.fullName,
                  email: booking.email,
                  phone: booking.phoneNumber,
                  lastReport: booking.createdAt,
                  riskLevel: 'Medium', // Mock for now
                  predictions: [], // Will be populated when analytics endpoint exists
                  reports: []
                });
              }
            });
            setDoctorPatients(Array.from(patientsMap.values()));
          }
        } catch (patientsError) {
          console.log('Patients data not available through bookings, using mock data');
          // Keep existing mock data structure
        }

      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError('Failed to load doctor data');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [isAuthenticated, user, authLoading]);

  const specialties = ['Cardiology', 'Neurology', 'Ophthalmology', 'Pulmonology'];
  
  const getSpecialtyIcon = (specialty) => {
    switch (specialty) {
      case 'Cardiology': return FaHeart;
      case 'Neurology': return FaBrain;
      case 'Ophthalmology': return FaEye;
      case 'Pulmonology': return FaLungs;
      default: return FaUserMd;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'High': return FaExclamationTriangle;
      case 'Medium': return FaInfoCircle;
      case 'Low': return FaInfoCircle;
      default: return FaInfoCircle;
    }
  };

  // Use real patient data if available, otherwise fallback to mock data
  const currentPatients = doctorPatients.length > 0 ? doctorPatients : (patientsBySpecialty[selectedSpecialty] || []);
  const filteredPatients = currentPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPatientModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closePatientModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-full mr-4">
              <FaUserMd className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Doctor Dashboard</h1>
              <p className="text-gray-600">
                Welcome, {doctorProfile?.fullName || user?.fullName || 'Doctor'} - {selectedSpecialty} Specialist
              </p>
              {doctorProfile && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    {doctorProfile.qualification} • {doctorProfile.experience}+ years experience
                  </p>
                  <p className="text-sm text-gray-500">
                    {doctorProfile.email} • License: {doctorProfile.licenseNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'dashboard' 
                  ? 'bg-pink-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'appointments' 
                  ? 'bg-pink-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'patients' 
                  ? 'bg-pink-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              My Patients
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and Filter */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Search Patients</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Patients</span>
                  <span className="font-bold text-green-600">{currentPatients.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Risk</span>
                  <span className="font-bold text-red-600">
                    {currentPatients.filter(p => p.riskLevel === 'High').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Medium Risk</span>
                  <span className="font-bold text-yellow-600">
                    {currentPatients.filter(p => p.riskLevel === 'Medium').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low Risk</span>
                  <span className="font-bold text-green-600">
                    {currentPatients.filter(p => p.riskLevel === 'Low').length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Patient List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedSpecialty} Patients ({filteredPatients.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <FaFilter className="text-gray-400" />
                  <span className="text-sm text-gray-600">Filtered by specialty</span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => {
                    const RiskIcon = getRiskIcon(patient.riskLevel);
                    
                    return (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => openPatientModal(patient)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 text-lg">{patient.name}</h3>
                              <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center px-3 py-2 rounded-full border ${getRiskColor(patient.riskLevel)}`}>
                            <RiskIcon className="mr-2" />
                            <span className="font-medium">{patient.riskLevel} Risk</span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaCalendar className="mr-2" />
                            Last Report: {new Date(patient.lastReport).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaFileMedical className="mr-2" />
                            {patient.reports.length} report(s) available
                          </div>
                        </div>

                        {patient.predictions.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">Latest Predictions:</h4>
                            <div className="space-y-2">
                              {patient.predictions.slice(0, 2).map((prediction, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="text-gray-700">{prediction.disease}</span>
                                  <span className={`font-medium ${
                                    prediction.riskLevel === 'High' ? 'text-red-600' :
                                    prediction.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                  }`}>
                                    {prediction.probability}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FaUsers className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>No patients found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        </>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <DoctorBookings />
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <DoctorPatients />
        )}
      </div>

      {/* Patient Detail Modal */}
      {isModalOpen && selectedPatient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Patient Details</h2>
              <button
                onClick={closePatientModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Patient Info */}
              <div>
                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedPatient.name}</h3>
                      <p className="text-gray-600">{selectedPatient.age} years old • {selectedPatient.gender}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FaPhone className="mr-3 text-green-600" />
                      {selectedPatient.phone}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaEnvelope className="mr-3 text-green-600" />
                      {selectedPatient.email}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaCalendar className="mr-3 text-green-600" />
                      Last Report: {new Date(selectedPatient.lastReport).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Assessment</h3>
                  <div className={`flex items-center p-4 rounded-lg border ${getRiskColor(selectedPatient.riskLevel)}`}>
                    <FaExclamationTriangle className="mr-3 text-2xl" />
                    <div>
                      <div className="font-bold text-lg">{selectedPatient.riskLevel} Risk Level</div>
                      <div className="text-sm opacity-75">Based on latest AI analysis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Predictions and Reports */}
              <div className="space-y-6">
                {/* Predictions */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Disease Predictions</h3>
                  <div className="space-y-3">
                    {selectedPatient.predictions.map((prediction, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{prediction.disease}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                            {prediction.probability}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">Risk Level: {prediction.riskLevel}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reports */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Medical Reports</h3>
                  <div className="space-y-3">
                    {selectedPatient.reports.map((report, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <FaFileMedical className="text-green-600 mr-3 text-lg" />
                          <div>
                            <div className="font-medium text-gray-800">{report.name}</div>
                            <div className="text-sm text-gray-600">
                              {report.type} • {new Date(report.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button className="text-green-600 hover:text-green-700 transition-colors duration-300">
                          <FaDownload className="text-lg" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorDashboard;
