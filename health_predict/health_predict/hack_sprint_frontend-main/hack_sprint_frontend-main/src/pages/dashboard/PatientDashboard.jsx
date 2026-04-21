import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaFilePdf, 
  FaChartLine, 
  FaHeart, 
  FaBrain, 
  FaEye, 
  FaLungs,
  FaUser,
  FaCalendar,
  FaClock,
  FaDownload,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PatientBookings from '../../components/bookings/PatientBookings';
import PatientReports from '../../components/reports/PatientReports';
import NotificationContainer from '../../components/ui/NotificationContainer';
import UploadProgressModal from '../../components/ui/UploadProgressModal';
import useNotification from '../../hooks/useNotification';
import patientService from '../../utils/patientService';
import reportService from '../../utils/reportService';

const PatientDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { notifications, showSuccess, showError, showWarning, showInfo, removeNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientProfile, setPatientProfile] = useState(null);
  
  // Analytics and Recommendations state
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [selectedReportAnalytics, setSelectedReportAnalytics] = useState(null);
  const [selectedReportRecommendations, setSelectedReportRecommendations] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  
  // Upload progress state
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [uploadStep, setUploadStep] = useState('uploading');
  const [uploadMessage, setUploadMessage] = useState('Uploading Report...');
  const [uploadedReports, setUploadedReports] = useState([
    {
      id: 1,
      name: "Blood_Test_Report_2025.pdf",
      uploadDate: "2025-10-28",
      status: "analyzed",
      predictions: [
        { disease: "Diabetes Type 2", risk: "High", probability: "85%", category: "Metabolic" },
        { disease: "Hypertension", risk: "Medium", probability: "65%", category: "Cardiovascular" }
      ]
    },
    {
      id: 2,
      name: "ECG_Report_October.pdf",
      uploadDate: "2025-10-25",
      status: "analyzed",
      predictions: [
        { disease: "Atrial Fibrillation", risk: "Low", probability: "25%", category: "Cardiovascular" }
      ]
    },
    {
      id: 3,
      name: "Chest_Xray_2025.pdf",
      uploadDate: "2025-10-20",
      status: "processing",
      predictions: []
    }
  ]);

  // Fetch patient profile and data
  useEffect(() => {
    const fetchPatientData = async () => {
      if (!isAuthenticated || !user || authLoading) {
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Fetch patient profile
        const profileResponse = await patientService.getProfile();
        if (profileResponse.success) {
          setPatientProfile(profileResponse.data);
        }

        // Fetch patient reports using the correct report service
        try {
          console.log('PatientDashboard: Fetching reports...');
          const reportsResponse = await reportService.getPatientReports();
          console.log('PatientDashboard: Reports response:', reportsResponse);
          
          if (reportsResponse.success) {
            console.log('PatientDashboard: Setting reports:', reportsResponse.data);
            setUploadedReports(reportsResponse.data);
          } else {
            console.error('PatientDashboard: Reports fetch failed:', reportsResponse);
          }
        } catch (reportError) {
          console.error('PatientDashboard: Error fetching reports:', reportError);
          // Don't set error state for reports, just log it
          setUploadedReports([]);
        }

      } catch (error) {
        console.error('Error fetching patient data:', error);
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [isAuthenticated, user, authLoading]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setShowConsentModal(true);
    }
  };

  const handleConsentAccept = async () => {
    if (selectedFile && consentAgreed) {
      try {
        setShowUploadProgress(true);
        setShowAnalyticsModal(false);
        setShowRecommendationsModal(false);
        setShowConsentModal(false);
        
        console.log('Starting automated upload and processing...');
        console.log('Selected file:', selectedFile);
        
        const formData = reportService.createFormData(selectedFile, "Uploaded from Patient Dashboard");
        // Use the automated workflow with progress tracking
        await reportService.uploadAndProcessReport(formData, (step, message) => {
          setUploadStep(step);
          setUploadMessage(message);
          console.log(`Progress update: ${step} - ${message}`);
        });
        
        // Show success notification
        // showNotification('Report processed successfully! Analysis and recommendations are now available.', 'success');
        
        // Reload reports to get the updated list from backend
        try {
          const updatedReportsResponse = await reportService.getPatientReports();
          if (updatedReportsResponse.success) {
            setUploadedReports(updatedReportsResponse.data);
          }
        } catch (refreshError) {
          console.error('Error refreshing reports:', refreshError);
          // showNotification('Please refresh the page to see your uploaded report.', 'info');
        }
        
      } catch (error) {
        console.error('Upload and processing error:', error);
        
        // showNotification(
        //   error.message || 'Failed to process report. Please try again.',
        //   'error'
        // );
      } finally {
        setShowUploadProgress(false);
        // Reset upload progress state
        setUploadStep('uploading');
        setUploadMessage('Uploading Report...');
        setSelectedFile(null);
        setShowConsentModal(false);
        setConsentAgreed(false);
        // Reset file input
        if (document.getElementById('file-upload')) {
          document.getElementById('file-upload').value = '';
        }
      }
    }
  };

  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setConsentAgreed(false);
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await reportService.deleteReport(id);
      
      // Reload reports from backend
      const updatedReportsResponse = await reportService.getPatientReports();
      if (updatedReportsResponse.success) {
        setUploadedReports(updatedReportsResponse.data);
      }
      
      showSuccess('Report deleted successfully!');
    } catch (error) {
      console.error('Error deleting report:', error);
      showError('Failed to delete report: ' + error.message);
    }
  };

  // Analytics and AI Analysis handlers
  const handleAnalyzeReport = async (reportId) => {
    try {
      setAnalyticsLoading(true);
      showInfo('Analyzing report with AI... This may take a moment.');
      
      const analysisResponse = await reportService.analyzeReport(reportId);
      
      if (analysisResponse.success) {
        showSuccess('Report analysis completed successfully!');
        // Reload reports to get updated status
        const updatedReportsResponse = await reportService.getPatientReports();
        if (updatedReportsResponse.success) {
          setUploadedReports(updatedReportsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error analyzing report:', error);
      showError('Failed to analyze report: ' + error.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleViewAnalytics = async (reportId) => {
    try {
      setAnalyticsLoading(true);
      setShowAnalyticsModal(true);
      
      const analyticsResponse = await reportService.getReportAnalytics(reportId);
      
      if (analyticsResponse.success) {
        console.log('Fetched analytics:', analyticsResponse.data);
        setSelectedReportAnalytics(analyticsResponse.data);
      } else {
        showError('No analytics found for this report. Please analyze it first.');
        setShowAnalyticsModal(false);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showError('Failed to load analytics: ' + error.message);
      setShowAnalyticsModal(false);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleGenerateRecommendations = async (analyticsId) => {
    try {
      setRecommendationsLoading(true);
      setShowRecommendationsModal(true);
      
      console.log('Generating recommendations for analytics ID:', analyticsId);
      
      // First try to get existing recommendations
      try {
        const existingRecommendations = await reportService.getRecommendationByAnalytics(analyticsId);
        if (existingRecommendations.success) {
          console.log('Found existing recommendations:', existingRecommendations.data);
          setSelectedReportRecommendations(existingRecommendations.data);
          showSuccess('Recommendations loaded successfully!');
          return;
        }
      } catch (existingError) {
        console.log('No existing recommendations, generating new ones...');
      }
      
      // Generate new recommendations if none exist
      const recommendationsResponse = await reportService.generateRecommendations(analyticsId);
      
      if (recommendationsResponse.success) {
        console.log('Generated new recommendations:', recommendationsResponse.data);
        setSelectedReportRecommendations(recommendationsResponse.data);
        showSuccess('Health recommendations generated successfully!');
      } else {
        showError('Failed to generate recommendations. Please try again.');
        setShowRecommendationsModal(false);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      showError('Failed to generate recommendations: ' + error.message);
      setShowRecommendationsModal(false);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Cardiovascular': return FaHeart;
      case 'Neurological': return FaBrain;
      case 'Ophthalmological': return FaEye;
      case 'Respiratory': return FaLungs;
      default: return FaInfoCircle;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzed': return FaCheckCircle;
      case 'processing': return FaClock;
      case 'error': return FaExclamationTriangle;
      default: return FaInfoCircle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed': return 'text-green-600';
      case 'processing': return 'text-pink-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mr-4">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Patient Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {patientProfile?.fullName || user?.fullName || 'Patient'}
              </p>
              {patientProfile && (
                <p className="text-sm text-gray-500 mt-1">
                  {patientProfile.email} • Last login: {patientProfile.lastLogin ? new Date(patientProfile.lastLogin).toLocaleDateString() : 'Today'}
                </p>
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
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'reports' 
                  ? 'bg-pink-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              My Reports
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUpload className="mr-3 text-pink-600" />
                Upload Report
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-300">
                <FaFilePdf className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drop your medical reports here or click to browse
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-300"
                >
                  Choose File
                </label>
              </div>
              
              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-blue-50 rounded-lg"
                >
                  <p className="text-sm text-pink-800">
                    Selected: {selectedFile.name}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Upload & Analyze
                  </motion.button>
                </motion.div>
              )}

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-600">{uploadedReports.length}</div>
                  <div className="text-sm text-pink-800">Total Reports</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {uploadedReports.filter(r => r.status === 'analyzed').length}
                  </div>
                  <div className="text-sm text-green-800">Analyzed</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reports and Analysis */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recent Reports */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartLine className="mr-3 text-pink-600" />
                Your Reports & Predictions
              </h2>
              
              <div className="space-y-4">
                {uploadedReports.map((report, index) => {
                  const StatusIcon = getStatusIcon(report.status);
                  
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <FaFilePdf className="text-red-500 text-xl mr-3" />
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {report.file ? report.file.split('/').pop() : 'Medical Report'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <FaCalendar className="mr-1" />
                              {new Date(report.createdAt).toLocaleDateString()}
                            </div>
                            {report.notes && (
                              <div className="text-sm text-gray-500 mt-1">{report.notes}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className={`flex items-center ${getStatusColor(report.status)}`}>
                            <StatusIcon className="mr-1" />
                            <span className="text-sm capitalize">{report.status}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {/* Show report details and download link */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Status:</strong> {report.status}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>File ID:</strong> {report.id.slice(0, 8)}...
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            {report.file && (
                              <a
                                href={report.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-pink-600 hover:text-pink-700 text-sm"
                              >
                                <FaDownload className="mr-1" />
                                Download PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Analysis Actions */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        {report.status === 'uploaded' && (
                          <button
                            onClick={() => handleAnalyzeReport(report.id)}
                            disabled={analyticsLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-sm"
                          >
                            {analyticsLoading ? (
                              <>
                                <FaSpinner className="animate-spin mr-2 inline" />
                                Analyzing...
                              </>
                            ) : (
                              'Analyze with AI'
                            )}
                          </button>
                        )}
                        
                        {report.status === 'analyzed' && (
                          <>
                            <button
                              onClick={() => handleViewAnalytics(report.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
                            >
                              View Analytics
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  // First get analytics to get the analytics ID
                                  const analyticsResponse = await reportService.getReportAnalytics(report.id);
                                  if (analyticsResponse.success) {
                                    // Then generate recommendations using the analytics ID
                                    await handleGenerateRecommendations(analyticsResponse.data.id);
                                  } else {
                                    showError('Please analyze the report first to get recommendations.');
                                  }
                                } catch (error) {
                                  showError('Please analyze the report first to get recommendations.');
                                }
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm"
                            >
                              Get Recommendations
                            </button>
                          </>
                        )}
                      </div>
                      
                      {report.status === 'processing' && (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                          <span className="text-pink-600">Analyzing your report...</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
                
                {uploadedReports.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaFilePdf className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>No reports uploaded yet. Upload your first medical report to get started!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Summary</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Risk Categories</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <FaHeart className="text-red-500 mr-2" />
                        Cardiovascular
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">Medium</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <FaBrain className="text-purple-500 mr-2" />
                        Neurological
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        <FaEye className="text-pink-500 mr-2" />
                        Vision
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Low</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Recommendations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0" />
                      Schedule regular cardiology check-up
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0" />
                      Monitor blood glucose levels weekly
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-2 mt-0.5 shrink-0" />
                      Maintain heart-healthy diet
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <PatientBookings />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <PatientReports />
        )}
      </div>

      {/* Analytics Modal */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Report Analytics</h2>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                x
              </button>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
                <span>Loading analytics...</span>
              </div>
            ) : selectedReportAnalytics ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">AI Analysis Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Diagnosis</p>
                      <p className="font-semibold text-gray-800">
                        {selectedReportAnalytics.diagnosis?.prediction || 
                         selectedReportAnalytics.diagnosis || 
                         'No diagnosis available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Disease Likelihood</p>
                      <p className="font-semibold text-gray-800">
                        {selectedReportAnalytics.diagnosis?.confidence 
                          ? (selectedReportAnalytics.diagnosis.confidence * 100).toFixed(1) + '%'
                          : 'Not available'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Severity</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedReportAnalytics.severity === 'high' ? 'bg-red-100 text-red-800' :
                        selectedReportAnalytics.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedReportAnalytics.severity}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Analysis Date</p>
                      <p className="text-sm text-gray-800">{new Date(selectedReportAnalytics.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No analytics data available</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Recommendations Modal */}
      {showRecommendationsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Health Recommendations</h2>
              <button
                onClick={() => setShowRecommendationsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {recommendationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-2xl text-purple-600 mr-3" />
                <span>Generating recommendations...</span>
              </div>
            ) : selectedReportRecommendations ? (
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">AI-Generated Health Recommendations</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedReportRecommendations.status === 'generated' ? 'bg-green-100 text-green-800' :
                        selectedReportRecommendations.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedReportRecommendations.status || 'Generated'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Generated</p>
                      <p className="text-sm text-gray-800">
                        {selectedReportRecommendations.createdAt 
                          ? new Date(selectedReportRecommendations.createdAt).toLocaleDateString()
                          : 'Just now'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Recommendations</h3>
                  {selectedReportRecommendations.recommendations ? (
                    <div className="prose prose-sm max-w-none">
                      {typeof selectedReportRecommendations.recommendations === 'string' 
                        ? selectedReportRecommendations.recommendations.split('\n').map((line, index) => (
                            line.trim() && (
                              <p key={index} className="mb-2 text-gray-700">
                                {line}
                              </p>
                            )
                          ))
                        : <p className="text-gray-700">{JSON.stringify(selectedReportRecommendations.recommendations, null, 2)}</p>
                      }
                    </div>
                  ) : (
                    <p className="text-gray-600">No recommendations available</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recommendations available</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
        position="top-right" 
      />

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaInfoCircle className="text-pink-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Usage Consent</h2>
              <p className="text-gray-600">Before we analyze your medical report, please review our data usage policy.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How We Use Your Data:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• AI analysis for disease prediction</li>
                  <li>• Improving our prediction algorithms</li>
                  <li>• Medical research (anonymized)</li>
                  <li>• Statistical analysis for better healthcare</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Your Privacy is Protected:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All data is encrypted and secure</li>
                  <li>• Personal information is anonymized</li>
                  <li>• HIPAA compliant handling</li>
                  <li>• You can withdraw consent anytime</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I consent to the use of my medical data for AI analysis, research purposes, and algorithm improvement. 
                  I understand that my data will be anonymized and handled according to HIPAA regulations.
                </span>
              </label>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConsentDecline}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Decline
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConsentAccept}
                disabled={!consentAgreed}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-300 ${
                  consentAgreed
                    ? 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Accept & Upload
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Progress Modal */}
      <UploadProgressModal
        isVisible={showUploadProgress}
        currentStep={uploadStep}
        message={uploadMessage}
      />
    </div>
  );
};

export default PatientDashboard;
