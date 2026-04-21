import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaVideo, 
  FaHospital, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf,
  FaSpinner,
  FaEye,
  FaUserMd,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../utils/bookingService';

const PatientBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getPatientBookings();
      
      if (response.success) {
        setBookings(response.data || []);
      } else {
        setError(response.message || 'Failed to load appointments');
      }
    } catch (error) {
      setError(error.message || 'Failed to load appointments');
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return FaCheckCircle;
      case 'pending': return FaHourglassHalf;
      case 'rejected': return FaTimesCircle;
      case 'completed': return FaCheckCircle;
      case 'cancelled': return FaTimesCircle;
      default: return FaHourglassHalf;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-pink-600 mr-4" />
        <span className="text-gray-600">Loading your appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Appointments</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={loadBookings}
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
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <span className="text-sm text-gray-600">{bookings.length} appointments</span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Appointments Yet</h3>
          <p className="text-gray-500 mb-6">You haven't scheduled any appointments.</p>
          <a 
            href="/schedule-consultation" 
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300"
          >
            <FaCalendarAlt className="mr-2" />
            Schedule Appointment
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                      <FaUserMd className="text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{booking.doctor?.fullName || 'Dr. Name'}</h3>
                      <p className="text-sm text-gray-600">{booking.doctor?.specialization || 'Specialist'}</p>
                    </div>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    <StatusIcon className="mr-1 text-xs" />
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(booking.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>{booking.appointmentTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {booking.appointmentType === 'videocall' ? (
                      <>
                        <FaVideo className="mr-2" />
                        <span>Video Call</span>
                      </>
                    ) : (
                      <>
                        <FaHospital className="mr-2" />
                        <span>In-Person</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Reason:</strong> {booking.reasonForConsultation}
                  </p>
                </div>

                {booking.doctorResponse && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>Doctor's Response:</strong> {booking.doctorResponse}
                    </p>
                  </div>
                )}

                {booking.meetingLink && booking.status === 'confirmed' && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-700 mb-2">
                      <strong>Meeting Link:</strong>
                    </p>
                    <a 
                      href={booking.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline text-sm break-all"
                    >
                      {booking.meetingLink}
                    </a>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center"
                  >
                    <FaEye className="mr-1" />
                    View Details
                  </button>
                  
                  {booking.status === 'pending' && (
                    <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-300">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Doctor Information</h4>
                    <p className="text-gray-600">{selectedBooking.doctor?.fullName || 'Dr. Name'}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.doctor?.specialization}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Appointment Status</h4>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Date</h4>
                    <p className="text-gray-600">{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Time</h4>
                    <p className="text-gray-600">{selectedBooking.appointmentTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Type</h4>
                    <p className="text-gray-600">
                      {selectedBooking.appointmentType === 'videocall' ? 'Video Call' : 'In-Person'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Patient Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><strong>Name:</strong> {selectedBooking.fullName}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedBooking.email}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedBooking.phoneNumber}</p>
                    {selectedBooking.dateOfBirth && (
                      <p className="text-sm"><strong>Date of Birth:</strong> {new Date(selectedBooking.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Reason for Consultation</h4>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedBooking.reasonForConsultation}</p>
                </div>

                {selectedBooking.currentMedications && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Current Medications</h4>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedBooking.currentMedications}</p>
                  </div>
                )}

                {selectedBooking.knownAllergies && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Known Allergies</h4>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{selectedBooking.knownAllergies}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PatientBookings;