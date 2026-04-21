import apiClient from './api.js';

class HospitalService {
  /**
   * Search for nearby hospitals, clinics, and pharmacies
   */
  async searchNearbyHospitals(latitude, longitude, radius = 15000) {
    try {
      console.log('HospitalService: Searching nearby hospitals...');
      console.log('Location:', { latitude, longitude, radius });
      
      const requestData = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: radius
      };
      
      const response = await apiClient.post('/hospital/nearby', requestData);
      
      console.log('Hospital search response:', response);
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Hospitals retrieved successfully'
      };
    } catch (error) {
      console.error('Error searching nearby hospitals:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid location coordinates');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error while searching hospitals. Please try again later');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to search nearby hospitals');
    }
  }

  /**
   * Validate coordinates
   */
  validateCoordinates(latitude, longitude) {
    const errors = {};

    if (!latitude || isNaN(parseFloat(latitude))) {
      errors.latitude = 'Valid latitude is required';
    } else {
      const lat = parseFloat(latitude);
      if (lat < -90 || lat > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    if (!longitude || isNaN(parseFloat(longitude))) {
      errors.longitude = 'Valid longitude is required';
    } else {
      const lon = parseFloat(longitude);
      if (lon < -180 || lon > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Transform backend hospital data for frontend use
   */
  transformHospitalData(backendData) {
    if (!backendData || !backendData.hospitals) {
      return [];
    }

    return backendData.hospitals.map(hospital => ({
      id: hospital.placeId,
      placeId: hospital.placeId,
      name: hospital.name,
      facilityType: hospital.facilityType,
      priority: hospital.priority,
      address: hospital.address,
      distance: hospital.distanceText,
      distanceValue: hospital.distance,
      location: hospital.location,
      coordinates: {
        lat: hospital.location.latitude,
        lng: hospital.location.longitude
      },
      
      // Contact information
      contactNumber: hospital.contactNumber !== 'Not available' ? hospital.contactNumber : null,
      emergencyContactNumber: hospital.emergencyContactNumber !== 'Not specified' ? hospital.emergencyContactNumber : null,
      
      // Images
      image: hospital.photo || hospital.photos?.[0] || 'https://images.unsplash.com/photo-1586773860418-d37222d8eee8?w=500&h=300&fit=crop',
      photos: hospital.photos || [],
      
      // Ratings and reviews
      rating: hospital.rating || 0,
      totalRatings: hospital.totalRatings || 0,
      
      // Availability
      isOpen: hospital.isOpenNow,
      availableNow: hospital.availableNow,
      openingHours: hospital.openingHours || [],
      
      // Additional info
      website: hospital.website !== 'Not available' ? hospital.website : null,
      description: hospital.description || `${hospital.name} is a ${hospital.facilityType} located at ${hospital.address}`,
      googleMapsUrl: hospital.googleMapsUrl,
      businessStatus: hospital.businessStatus,
      types: hospital.types || [],
      
      // Emergency specific
      isEmergencyHospital: hospital.isEmergencyHospital || false,
      
      // Derived properties for UI
      type: this.getDisplayType(hospital.facilityType, hospital.types),
      services: this.extractServices(hospital.types, hospital.name),
      emergencyWaitTime: this.estimateWaitTime(hospital.facilityType, hospital.isEmergencyHospital)
    }));
  }

  /**
   * Get display type for UI
   */
  getDisplayType(facilityType, types = []) {
    if (facilityType === 'hospital') {
      if (types.includes('doctor')) return 'Multi-specialty Hospital';
      return 'General Hospital';
    }
    if (facilityType === 'clinic') return 'Medical Clinic';
    if (facilityType === 'pharmacy') return 'Pharmacy';
    return 'Medical Facility';
  }

  /**
   * Extract services from types and name
   */
  extractServices(types = [], name = '') {
    const services = [];
    
    if (types.includes('hospital')) services.push('Hospital Care');
    if (types.includes('doctor')) services.push('Medical Consultation');
    if (types.includes('pharmacy')) services.push('Pharmacy');
    if (types.includes('health')) services.push('Health Services');
    
    // Add based on name analysis
    const nameLower = name.toLowerCase();
    if (nameLower.includes('emergency')) services.push('Emergency Care');
    if (nameLower.includes('ortho')) services.push('Orthopedic');
    if (nameLower.includes('cardio') || nameLower.includes('heart')) services.push('Cardiology');
    if (nameLower.includes('neuro')) services.push('Neurology');
    if (nameLower.includes('pediatric') || nameLower.includes('child')) services.push('Pediatrics');
    
    return services.length > 0 ? services : ['General Medical Services'];
  }

  /**
   * Estimate wait time based on facility type
   */
  estimateWaitTime(facilityType, isEmergency) {
    if (facilityType === 'hospital') {
      return isEmergency ? '10-15 mins' : '20-30 mins';
    }
    if (facilityType === 'clinic') return '15-25 mins';
    if (facilityType === 'pharmacy') return '5-10 mins';
    return '15-30 mins';
  }
}

// Export singleton instance
const hospitalService = new HospitalService();
export default hospitalService;