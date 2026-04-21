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
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaPills,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../utils/bookingService';
import { b } from 'framer-motion/client';

const DoctorBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [responseLoading, setResponseLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getDoctorBookings();
      console.log('Doctor bookings response:', response.data);
      if (response.success) {
        setBookings(response.data?.bookings || []);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingResponse = async (bookingId, status, doctorResponse = '') => {
    try {
      setResponseLoading(bookingId);
      const response = await bookingService.respondToBooking(bookingId, {
        status,
        doctorResponse
      });

      if (response.success) {
        // Update the booking in the local state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, doctorResponse }
            : booking
        ));
        setSelectedBooking(null);
      } else {
        alert('Failed to update booking: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking');
    } finally {
      setResponseLoading(null);
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

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const pendingCount = bookings.filter(booking => booking.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="animate-spin text-4xl text-pink-600 mr-4" />
        <span className="text-gray-600">Loading appointments...</span>
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
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Patient Appointments</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              {pendingCount} appointment{pendingCount !== 1 ? 's' : ''} awaiting response
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending ({bookings.filter(b => b.status === 'pending').length})</option>
            <option value="confirmed">Confirmed ({bookings.filter(b => b.status === 'confirmed').length})</option>
            <option value="completed">Completed ({bookings.filter(b => b.status === 'completed').length})</option>
            <option value="rejected">Rejected ({bookings.filter(b => b.status === 'rejected').length})</option>
          </select>
          <span className="text-sm text-gray-600">{filteredBookings.length} appointments</span>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {statusFilter === 'all' ? 'No Appointments' : `No ${statusFilter} Appointments`}
          </h3>
          <p className="text-gray-500">
            {statusFilter === 'all' 
              ? "You don't have any scheduled appointments yet." 
              : `No appointments with ${statusFilter} status found.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking) => {
            const StatusIcon = getStatusIcon(booking.status);
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg border-2 p-6 hover:shadow-lg transition-shadow duration-300 ${
                  booking.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{booking.fullName}</h3>
                      <p className="text-sm text-gray-600">{booking.email}</p>
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

                {booking.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center text-yellow-700">
                      <FaHourglassHalf className="mr-2" />
                      <span className="font-medium">Action Required: Please respond to this appointment request</span>
                    </div>
                  </div>
                )}

                {booking.doctorResponse && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-700">
                      <strong>Your Response:</strong> {booking.doctorResponse}
                    </p>
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
                    <>
                      <button
                        onClick={() => handleBookingResponse(booking.id, 'confirmed', 'Appointment confirmed. I look forward to seeing you.')}
                        disabled={responseLoading === booking.id}
                        className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                      >
                        {responseLoading === booking.id ? (
                          <FaSpinner className="animate-spin mr-1" />
                        ) : (
                          <FaCheck className="mr-1" />
                        )}
                        Confirm
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center"
                      >
                        <FaTimes className="mr-1" />
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleBookingResponse(booking.id, 'completed')}
                      disabled={responseLoading === booking.id}
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                    >
                      {responseLoading === booking.id ? (
                        <FaSpinner className="animate-spin mr-1" />
                      ) : (
                        <FaCheckCircle className="mr-1" />
                      )}
                      Mark Complete
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Booking Details and Response Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Patient Details & Response</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Patient Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="flex items-center text-sm">
                        <FaUser className="mr-2 text-gray-500" />
                        <strong className="mr-2">Name:</strong> {selectedBooking.fullName}
                      </p>
                      <p className="flex items-center text-sm">
                        <FaEnvelope className="mr-2 text-gray-500" />
                        <strong className="mr-2">Email:</strong> {selectedBooking.email}
                      </p>
                      <p className="flex items-center text-sm">
                        <FaPhone className="mr-2 text-gray-500" />
                        <strong className="mr-2">Phone:</strong> {selectedBooking.phoneNumber}
                      </p>
                      {selectedBooking.dateOfBirth && (
                        <p className="text-sm">
                          <strong>Date of Birth:</strong> {new Date(selectedBooking.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Appointment Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Date</p>
                        <p className="font-medium">{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Time</p>
                        <p className="font-medium">{selectedBooking.appointmentTime}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Type</p>
                        <p className="font-medium flex items-center">
                          {selectedBooking.appointmentType === 'videocall' ? (
                            <>
                              <FaVideo className="mr-2" />
                              Video Call
                            </>
                          ) : (
                            <>
                              <FaHospital className="mr-2" />
                              In-Person Visit
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Medical Information</h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Reason for Consultation:</p>
                      <p className="text-gray-600">{selectedBooking.reasonForConsultation}</p>
                    </div>

                    {selectedBooking.currentMedications && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                          <FaPills className="mr-2" />
                          Current Medications:
                        </p>
                        <p className="text-blue-600 text-sm">{selectedBooking.currentMedications}</p>
                      </div>
                    )}

                    {selectedBooking.knownAllergies && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-red-700 mb-2 flex items-center">
                          <FaExclamationTriangle className="mr-2" />
                          Known Allergies:
                        </p>
                        <p className="text-red-600 text-sm">{selectedBooking.knownAllergies}</p>
                      </div>
                    )}
                  </div>

                  {/* Response Section */}
                  {selectedBooking.status === 'pending' && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Respond to Appointment</h4>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => handleBookingResponse(selectedBooking.id, 'confirmed', 'Appointment confirmed. I look forward to seeing you.')}
                          disabled={responseLoading === selectedBooking.id}
                          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                        >
                          {responseLoading === selectedBooking.id ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaCheck className="mr-2" />
                          )}
                          Confirm Appointment
                        </button>
                        
                        <div className="space-y-2">
                          <textarea 
                            placeholder="Optional: Add a message for rejection..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            rows={3}
                            id="rejectMessage"
                          />
                          <button
                            onClick={() => {
                              const message = document.getElementById('rejectMessage').value || 'Unfortunately, I cannot accommodate this appointment at the requested time.';
                              handleBookingResponse(selectedBooking.id, 'rejected', message);
                            }}
                            disabled={responseLoading === selectedBooking.id}
                            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                          >
                            {responseLoading === selectedBooking.id ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaTimes className="mr-2" />
                            )}
                            Reject Appointment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DoctorBookings;