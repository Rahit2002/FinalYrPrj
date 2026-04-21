import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaUserMd, 
  FaCalendarAlt, 
  FaEnvelope, 
  FaPhone,
  FaSpinner,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaEye,
  FaFilePdf,
  FaCalendarCheck,
  FaNotesMedical
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../utils/bookingService';
import reportService from '../../utils/reportService';

const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientReports, setPatientReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get all bookings for this doctor to extract patients
      const response = await bookingService.getDoctorBookings();
      
      if (response.success) {
        // Extract unique patients from bookings
        const bookings = response.data.bookings || [];
        const uniquePatientsMap = new Map();
        
        bookings.forEach(booking => {
          if (booking.patient) {
            const patientId = booking.patient.id;
            if (!uniquePatientsMap.has(patientId)) {
              uniquePatientsMap.set(patientId, {
                ...booking.patient,
                bookings: [],
                lastAppointment: booking.appointmentDate,
                totalAppointments: 0,
                confirmedAppointments: 0,
                pendingAppointments: 0
              });
            }
            
            const patient = uniquePatientsMap.get(patientId);
            patient.bookings.push(booking);
            patient.totalAppointments++;
            
            if (booking.status === 'confirmed') {
              patient.confirmedAppointments++;
            } else if (booking.status === 'pending') {
              patient.pendingAppointments++;
            }
            
            // Update last appointment date
            if (new Date(booking.appointmentDate) > new Date(patient.lastAppointment)) {
              patient.lastAppointment = booking.appointmentDate;
            }
          }
        });
        
        setPatients(Array.from(uniquePatientsMap.values()));
      } else {
        setError(response.message || 'Failed to load patients');
      }
    } catch (error) {
      setError(error.message || 'Failed to load patients');
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatientReports = async (patientId) => {
    try {
      setLoadingReports(true);
      
      // Note: This functionality requires additional backend endpoint
      // For now, we'll show a placeholder
      const response = await reportService.getPatientReportsForDoctor(patientId);
      
      if (response.success) {
        setPatientReports(response.data || []);
      } else {
        setPatientReports([]);
        console.log('Patient reports for doctors not yet implemented');
      }
    } catch (error) {
      console.error('Error loading patient reports:', error);
      setPatientReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    loadPatientReports(patient.id);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && patient.pendingAppointments > 0) ||
                         (statusFilter === 'completed' && patient.confirmedAppointments > 0);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-pink-600 mr-4" />
        <span className="text-gray-600">Loading your patients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <FaExclamationTriangle className="text-red-600 text-4xl mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Patients</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={loadPatients}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
        <span className="text-sm text-gray-600">{filteredPatients.length} patients</span>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">All Patients</option>
              <option value="active">Active Appointments</option>
              <option value="completed">Completed Appointments</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {patients.length === 0 ? 'No Patients Yet' : 'No Patients Found'}
          </h3>
          <p className="text-gray-500">
            {patients.length === 0 
              ? 'Patients will appear here after they book appointments with you.' 
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPatients.map((patient) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.fullName}</h3>
                    <p className="text-sm text-gray-600">{patient.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="text-xs text-gray-400 font-mono">{patient.id.slice(0, 8)}...</p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarCheck className="mr-2" />
                  <div>
                    <p className="text-sm">Total Appointments</p>
                    <p className="font-semibold">{patient.totalAppointments}</p>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <FaCalendarAlt className="mr-2" />
                  <div>
                    <p className="text-sm">Confirmed</p>
                    <p className="font-semibold">{patient.confirmedAppointments}</p>
                  </div>
                </div>
                <div className="flex items-center text-yellow-600">
                  <FaCalendarAlt className="mr-2" />
                  <div>
                    <p className="text-sm">Pending</p>
                    <p className="font-semibold">{patient.pendingAppointments}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <div>
                    <p className="text-sm">Last Visit</p>
                    <p className="font-semibold text-xs">
                      {new Date(patient.lastAppointment).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {patient.phoneNumber && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-2" />
                      <span className="text-sm">{patient.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-2" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleViewPatient(patient)}
                  className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center"
                >
                  <FaEye className="mr-1" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Patient Details</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Patient Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedPatient.fullName}</p>
                      <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedPatient.email}</p>
                    </div>
                    <div>
                      {selectedPatient.phoneNumber && (
                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedPatient.phoneNumber}</p>
                      )}
                      <p className="text-sm text-gray-600"><strong>Patient ID:</strong> {selectedPatient.id}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment History */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Appointment History</h4>
                  <div className="space-y-3">
                    {selectedPatient.bookings?.map((booking) => (
                      <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-500 mr-2" />
                            <span className="font-medium">{new Date(booking.appointmentDate).toLocaleDateString()}</span>
                            <span className="ml-2 text-gray-600">at {booking.appointmentTime}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'text-green-600 bg-green-100' :
                            booking.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                            booking.status === 'rejected' ? 'text-red-600 bg-red-100' :
                            'text-gray-600 bg-gray-100'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Type:</strong> {booking.appointmentType === 'videocall' ? 'Video Call' : 'In-Person'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Reason:</strong> {booking.reasonForConsultation}
                        </p>
                        {booking.doctorResponse && (
                          <p className="text-sm text-blue-600 mt-2">
                            <strong>Your Response:</strong> {booking.doctorResponse}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient Reports Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-700">Medical Reports</h4>
                    {loadingReports && (
                      <FaSpinner className="animate-spin text-pink-600" />
                    )}
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center text-yellow-700">
                      <FaExclamationTriangle className="mr-2" />
                      <div>
                        <p className="font-medium">Reports Access Not Available</p>
                        <p className="text-sm mt-1">
                          Doctor access to patient reports requires additional backend endpoints. 
                          This feature will be available once the backend implements doctor-patient report sharing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;