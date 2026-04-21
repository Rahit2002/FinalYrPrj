import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHospital, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaRoute, 
  FaClock, 
  FaAmbulance, 
  FaUserMd, 
  FaBed, 
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaHeartbeat,
  FaStethoscope,
  FaLocationArrow,
  FaSpinner
} from 'react-icons/fa';
import hospitalService from '../utils/hospitalService';

const EmergencyPage = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hospitalsPerPage = 6;
  
  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'
  
  // Hospital data state
  const [hospitals, setHospitals] = useState([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitalError, setHospitalError] = useState(null);
  const [hospitalSearchInfo, setHospitalSearchInfo] = useState(null);

  // Geolocation functions
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = {
          latitude,
          longitude,
          accuracy: position.coords.accuracy
        };
        setUserLocation(newLocation);
        setLocationPermissionStatus('granted');
        setIsLoadingLocation(false);
        console.log('User location obtained:', { latitude, longitude });
        
        // Load nearby hospitals after getting location
        loadNearbyHospitals(latitude, longitude);
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            setLocationPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);
      },
      options
    );
  };

  const loadNearbyHospitals = async (latitude, longitude, radius = 15000) => {
    try {
      setIsLoadingHospitals(true);
      setHospitalError(null);
      
      console.log('Loading hospitals for location:', { latitude, longitude, radius });
      
      const response = await hospitalService.searchNearbyHospitals(latitude, longitude, radius);
      console.log('Hospital service response:', response);
      
      if (response.success && response.data) {
        const transformedHospitals = hospitalService.transformHospitalData(response.data);
        setHospitals(transformedHospitals);
        setHospitalSearchInfo({
          totalHospitals: response.data.totalHospitals,
          totalClinics: response.data.totalClinics,
          totalPharmacies: response.data.totalPharmacies,
          searchLocation: response.data.searchLocation
        });
        console.log('Hospitals loaded successfully:', transformedHospitals);
      } else {
        throw new Error('Invalid response from hospital service');
      }
      
    } catch (error) {
      console.error('Error loading hospitals:', error);
      setHospitalError(error.message);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Auto-request location on component mount
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Pagination logic
  const indexOfLastHospital = currentPage * hospitalsPerPage;
  const indexOfFirstHospital = indexOfLastHospital - hospitalsPerPage;
  const currentHospitals = hospitals.slice(indexOfFirstHospital, indexOfLastHospital);
  const totalPages = Math.ceil(hospitals.length / hospitalsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (hospital) => {
    setSelectedHospital(hospital);
  };

  const closeModal = () => {
    setSelectedHospital(null);
  };

  const callEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  const callHospital = (hospital) => {
    const number = hospital.emergencyContactNumber || hospital.contactNumber;
    if (number) {
      window.location.href = `tel:${number}`;
    }
  };

  const openDirections = (hospital) => {
    if (hospital.googleMapsUrl) {
      window.open(hospital.googleMapsUrl, '_blank');
    } else {
      const address = encodeURIComponent(hospital.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
    }
  };

  const retryLoadHospitals = () => {
    if (userLocation) {
      loadNearbyHospitals(userLocation.latitude, userLocation.longitude);
    } else {
      requestLocationPermission();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-red-500 text-white py-10 px-4 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-18 h-18 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaAmbulance className="text-4xl text-gray-800" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6"><p className='text-white'>Emergency Services</p></h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find nearby hospitals and emergency medical services in your area
          </p>
          
          {/* Emergency Call Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => callEmergency('108')}
            className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg flex items-center mx-auto mb-8 hover:shadow-lg transition-all duration-300"
          >
            <FaPhoneAlt className="mr-3" />
            Call Emergency: 108
          </motion.button>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white text-gray-800 bg-opacity-20 px-4 py-2 rounded-full">
              <FaHeartbeat className="mr-2" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center bg-white text-gray-800 bg-opacity-20 px-4 py-2 rounded-full">
              <FaAmbulance className="mr-2" />
              <span>Emergency Transport</span>
            </div>
            <div className="flex items-center bg-white text-gray-800 bg-opacity-20 px-4 py-2 rounded-full">
              <FaStethoscope className="mr-2" />
              <span>Expert Care</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Location Permission Banner */}
      {locationPermissionStatus !== 'granted' && (
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 border-b border-blue-200 py-4 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaLocationArrow className="text-blue-600 mr-3" />
                <div>
                  <p className="text-blue-800 font-semibold">
                    {isLoadingLocation 
                      ? 'Getting your location...' 
                      : locationError 
                      ? 'Location access needed' 
                      : 'Enable location for accurate distances'
                    }
                  </p>
                  <p className="text-blue-600 text-sm">
                    {isLoadingLocation 
                      ? 'Please allow location access to find the nearest hospitals' 
                      : locationError 
                      ? locationError
                      : 'We need your location to show distances to nearby hospitals'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isLoadingLocation ? (
                  <FaSpinner className="animate-spin text-blue-600" />
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestLocationPermission}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center"
                  >
                    <FaLocationArrow className="mr-2" />
                    {locationError ? 'Retry' : 'Enable Location'}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Location Status Indicator */}
      {userLocation && (
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 border-b border-green-200 py-3 px-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center">
              <FaLocationArrow className="text-green-600 mr-2" />
              <p className="text-green-800">
                <span className="font-semibold">Location enabled</span> - Showing distances from your current location
              </p>
              <span className="ml-2 text-green-600 text-sm">
                (Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)})
              </span>
            </div>
          </div>
        </motion.section>
      )}

      {/* Hospitals Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {userLocation ? 'Nearby Emergency Hospitals' : 'Emergency Hospitals'}
            </h2>
            <p className="text-xl text-gray-600">
              {userLocation 
                ? 'Hospitals sorted by distance from your location' 
                : 'Find emergency medical facilities in your area'
              }
            </p>
            
            {/* Hospital Search Info */}
            {hospitalSearchInfo && (
              <div className="mt-4 text-sm text-gray-500">
                Found {hospitalSearchInfo.totalHospitals} hospitals, {hospitalSearchInfo.totalClinics} clinics, and {hospitalSearchInfo.totalPharmacies} pharmacies
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoadingHospitals && (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Searching for nearby hospitals...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          )}

          {/* Error State */}
          {hospitalError && !isLoadingHospitals && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-red-50 rounded-lg border border-red-200"
            >
              <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
              <p className="text-lg text-red-800 mb-2">Failed to load hospital data</p>
              <p className="text-red-600 mb-4">{hospitalError}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retryLoadHospitals}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Retry
              </motion.button>
            </motion.div>
          )}

          {/* No Hospitals Found */}
          {!isLoadingHospitals && !hospitalError && hospitals.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
            >
              <FaHospital className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">No hospitals found in your area</p>
              <p className="text-gray-500 mb-4">Try enabling location access for better results</p>
              {!userLocation && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestLocationPermission}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Enable Location
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Hospital Cards */}
          {!isLoadingHospitals && hospitals.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentHospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => openModal(hospital)}
              >
                <div className="relative">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {hospital.distance}
                  </div>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ {hospital.rating}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <FaHospital className="text-red-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{hospital.type}</p>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>

                  {/* <div className="flex items-center text-gray-600 mb-4">
                    <FaClock className="mr-2 text-orange-500" />
                    <span className="text-sm">Wait Time: {hospital.emergencyWaitTime}</span>
                  </div> */}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hospital.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        callHospital(hospital);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaPhoneAlt className="mr-1" />
                      Call
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDirections(hospital);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaRoute className="mr-1" />
                      Directions
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>)}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaChevronLeft />
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-green-400 text-white font-bold'
                      : 'text-gray-800 font-semibold hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          
          )}
        </div>
      </motion.section>

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedHospital.image}
                alt={selectedHospital.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors duration-300"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                {selectedHospital.distance} away
              </div>
            </div>

            <div className="p-8">
              {/* Hospital Name and Rating */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedHospital.name}</h2>
                  <p className="text-lg text-gray-600">{selectedHospital.type}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-500">⭐ {selectedHospital.rating}</div>
                  <p className="text-sm text-gray-600">Patient Rating</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-red-50 p-4 rounded-lg">
                  <FaHospital className="text-3xl text-red-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">{selectedHospital.type}</div>
                  <p className="text-sm text-gray-600">Facility Type</p>
                </div>
                <div className="text-center bg-blue-50 p-4 rounded-lg">
                  <FaClock className="text-3xl text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">
                    {selectedHospital.isOpen ? 'Open Now' : 'Closed'}
                  </div>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div className="text-center bg-green-50 p-4 rounded-lg">
                  <FaClock className="text-3xl text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">{selectedHospital.emergencyWaitTime}</div>
                  <p className="text-sm text-gray-600">Est. Wait Time</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">About This Hospital</h3>
                <p className="text-gray-600 leading-relaxed">{selectedHospital.description}</p>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedHospital.emergencyContactNumber && (
                    <div className="flex items-center">
                      <FaExclamationTriangle className="text-red-600 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800">Emergency Line</p>
                        <p className="text-gray-600">{selectedHospital.emergencyContactNumber}</p>
                      </div>
                    </div>
                  )}
                  {selectedHospital.contactNumber && (
                    <div className="flex items-center">
                      <FaPhoneAlt className="text-blue-600 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-800">General Line</p>
                        <p className="text-gray-600">{selectedHospital.contactNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-start mt-4">
                  <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Address</p>
                    <p className="text-gray-600">{selectedHospital.address}</p>
                  </div>
                </div>
                {selectedHospital.website && (
                  <div className="flex items-center mt-4">
                    <FaHospital className="text-green-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">Website</p>
                      <a 
                        href={selectedHospital.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {selectedHospital.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Services Available</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.services.map((service, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              {selectedHospital.openingHours && selectedHospital.openingHours.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Opening Hours</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedHospital.openingHours.map((hours, index) => (
                      <div key={index} className="flex items-center">
                        <FaClock className="text-blue-600 mr-2" />
                        <span className="text-gray-700">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Information */}
              {selectedHospital.totalRatings > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Patient Reviews</h3>
                  <p className="text-gray-600">
                    Based on {selectedHospital.totalRatings} patient reviews
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {selectedHospital.emergencyContactNumber && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => callEmergency(selectedHospital.emergencyContactNumber)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center"
                  >
                    <FaPhoneAlt className="mr-2" />
                    Call Emergency
                  </motion.button>
                )}
                
                {selectedHospital.contactNumber && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => callEmergency(selectedHospital.contactNumber)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center"
                  >
                    <FaPhoneAlt className="mr-2" />
                    Call Hospital
                  </motion.button>
                )}

                {!selectedHospital.contactNumber && !selectedHospital.emergencyContactNumber && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => callEmergency('108')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center"
                  >
                    <FaPhoneAlt className="mr-2" />
                    Call Emergency (108)
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openDirections(selectedHospital)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center"
                >
                  <FaRoute className="mr-2" />
                  Get Directions
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;