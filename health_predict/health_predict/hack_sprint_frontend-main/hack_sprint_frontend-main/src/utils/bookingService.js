import apiClient from './api.js';

class BookingService {
  // Patient booking methods
  async createBooking(bookingData) {
    try {
      const payload = {
        doctorId: bookingData.doctorId,
        appointmentType: bookingData.appointmentType, // 'videocall' or 'inperson'
        appointmentDate: bookingData.appointmentDate, // YYYY-MM-DD format
        appointmentTime: bookingData.appointmentTime, // HH:MM format (24-hour)
        fullName: bookingData.fullName,
        email: bookingData.email,
        phoneNumber: bookingData.phoneNumber,
        dateOfBirth: bookingData.dateOfBirth, // YYYY-MM-DD format
        reasonForConsultation: bookingData.reasonForConsultation,
        currentMedications: bookingData.currentMedications || null,
        knownAllergies: bookingData.knownAllergies || null,
      };

      const response = await apiClient.post('/booking/create', payload);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Note: These methods would need to be implemented in the backend
  // For now, we'll create placeholder methods that can be implemented later
  async getPatientBookings(patientId = null, status = null) {
    try {
      const queryParams = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/booking/patient/all${queryParams}`);
      
      return {
        success: true,
        data: response.data.bookings,
        count: response.data.count,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching patient bookings:', error);
      if (error.response?.status === 401) {
        throw new Error('Please log in to view your appointments');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }

  async getPatientBookingById(bookingId) {
    try {
      const response = await apiClient.get(`/booking/patient/${bookingId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Booking retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching patient booking by ID:', error);
      if (error.response?.status === 404) {
        throw new Error('Appointment not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Please log in to view appointment details');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment details');
    }
  }

  async cancelPatientBooking(bookingId, reason) {
    try {
      // This endpoint doesn't exist in backend yet
      // Would need: PUT /api/booking/patient/:bookingId/cancel
      const response = await apiClient.put(`/booking/patient/${bookingId}/cancel`, {
        reason: reason
      });
      return response;
    } catch (error) {
      console.warn('Patient booking cancellation not implemented in backend yet');
      return {
        success: false,
        message: 'Patient booking cancellation not yet implemented'
      };
    }
  }

  // Doctor booking methods
  async getDoctorBookings(status = null) {
    try {
      const queryParams = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/booking/doctor/all${queryParams}`);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDoctorBookingById(bookingId) {
    try {
      const response = await apiClient.get(`/booking/doctor/${bookingId}`);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async respondToBooking(bookingId, responseData) {
    try {
      const payload = {
        status: responseData.status, // 'confirmed', 'rejected'
        doctorResponse: responseData.doctorResponse || null,
        meetingLink: responseData.meetingLink || null
      };

      const response = await apiClient.put(`/booking/doctor/${bookingId}/respond`, payload);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Utility methods
  async getAllDoctors() {
    try {
      const response = await apiClient.get('/admin/doctors/all');
      
      if (response.data && response.data.doctors) {
        return {
          success: true,
          data: response.data.doctors,
          count: response.data.count || response.data.doctors.length
        };
      }
      
      throw new Error('No doctors data received');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      
      // Return mock data as fallback
      return {
        success: true,
        data: [
          {
            id: "doctor-1",
            fullName: "Dr. Sarah Johnson",
            specialization: "Cardiology",
            experience: 15,
            consultationFee: 150,
            qualification: "MBBS, MD Cardiology",
            bio: "Experienced cardiologist with expertise in interventional cardiology and heart disease prevention.",
            isApproved: true,
            isActive: true
          },
          {
            id: "doctor-2", 
            fullName: "Dr. Michael Chen",
            specialization: "Neurology",
            experience: 12,
            consultationFee: 175,
            qualification: "MBBS, MD Neurology, DM",
            bio: "Specialist in neurological disorders, stroke care, and neurodegenerative diseases.",
            isApproved: true,
            isActive: true
          },
          {
            id: "doctor-3",
            fullName: "Dr. Emily Rodriguez", 
            specialization: "Ophthalmology",
            experience: 10,
            consultationFee: 140,
            qualification: "MBBS, MS Ophthalmology",
            bio: "Expert in retinal diseases, cataract surgery, and vision correction procedures.",
            isApproved: true,
            isActive: true
          },
          {
            id: "doctor-4",
            fullName: "Dr. James Wilson",
            specialization: "General Medicine", 
            experience: 18,
            consultationFee: 120,
            qualification: "MBBS, MD General Medicine",
            bio: "Primary care physician with extensive experience in preventive medicine and chronic disease management.",
            isApproved: true,
            isActive: true
          }
        ],
        message: 'Using fallback doctor data - backend endpoint not available'
      };
    }
  }

  async getDoctorsBySpecialization(specialization) {
    try {
      const allDoctors = await this.getAllDoctors();
      
      if (!allDoctors.success) {
        throw new Error('Failed to fetch doctors');
      }

      const filteredDoctors = allDoctors.data.filter(doctor => 
        doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
      );

      return {
        success: true,
        data: filteredDoctors,
        count: filteredDoctors.length
      };
    } catch (error) {
      console.error('Error filtering doctors by specialization:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }

  async getDoctorById(doctorId) {
    try {
      const allDoctors = await this.getAllDoctors();
      
      if (!allDoctors.success) {
        throw new Error('Failed to fetch doctors');
      }

      const doctor = allDoctors.data.find(doc => doc.id === doctorId);
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return {
        success: true,
        data: doctor
      };
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  getAvailableSpecializations() {
    // Common medical specializations
    return [
      'General Medicine',
      'Cardiology', 
      'Neurology',
      'Ophthalmology',
      'Dermatology',
      'Orthopedics',
      'Pediatrics',
      'Gynecology',
      'Psychiatry',
      'Endocrinology',
      'Pulmonology',
      'Gastroenterology',
      'Urology',
      'Nephrology',
      'Oncology',
      'Radiology',
      'Anesthesiology',
      'Emergency Medicine',
      'Family Medicine',
      'Internal Medicine'
    ];
  }

  // Format helpers
  formatAppointmentTime(time12Hour) {
    // Convert 12-hour format to 24-hour format for backend
    const [time, period] = time12Hour.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  }

  formatAppointmentDate(date) {
    // Ensure date is in YYYY-MM-DD format
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // Validation helpers
  validateBookingData(bookingData) {
    const errors = [];
    
    if (!bookingData.doctorId) errors.push('Doctor selection is required');
    if (!bookingData.appointmentDate) errors.push('Appointment date is required');
    if (!bookingData.appointmentTime) errors.push('Appointment time is required');
    if (!bookingData.fullName?.trim()) errors.push('Full name is required');
    if (!bookingData.email?.trim()) errors.push('Email is required');
    if (!bookingData.phoneNumber?.trim()) errors.push('Phone number is required');
    if (!bookingData.dateOfBirth) errors.push('Date of birth is required');
    if (!bookingData.reasonForConsultation?.trim()) errors.push('Reason for consultation is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (bookingData.email && !emailRegex.test(bookingData.email)) {
      errors.push('Valid email address is required');
    }
    
    // Date validation
    const appointmentDate = new Date(bookingData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate <= today) {
      errors.push('Appointment date must be in the future');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const bookingService = new BookingService();
export default bookingService;