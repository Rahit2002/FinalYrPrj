import apiClient from './api.js';

class ReportService {
  // Patient report methods
  async getPatientReports() {
    try {
      console.log('ReportService: Fetching patient reports...');
      console.log('API Base URL:', apiClient.client.defaults.baseURL);
      console.log('Request URL: /report/my-reports');
      console.log('With credentials:', apiClient.client.defaults.withCredentials);
      
      const response = await apiClient.get('/report/my-reports');
      
      console.log('Get reports response:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.success);
      
      return {
        success: true,
        data: response.data.data || response.data || [],
        count: response.data.count || 0,
        message: response.data.message || 'Reports retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.message.includes('403') || error.message.includes('Only patients')) {
        throw new Error('Only patients can view their reports');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to view your reports');
      }
      throw new Error(error.message || 'Failed to fetch reports');
    }
  }

  async getReportById(reportId) {
    try {
      const response = await apiClient.get(`/report/${reportId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: 'Report retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      if (error.message.includes('404')) {
        throw new Error('Report not found');
      }
      if (error.message.includes('403')) {
        throw new Error('You do not have permission to view this report');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to view report details');
      }
      throw new Error(error.message || 'Failed to fetch report');
    }
  }

  async uploadReport(formData) {
    try {
      console.log('ReportService: Starting upload...');
      console.log('FormData received:', formData);
      
      // FormData should contain:
      // - file: PDF file (matches backend upload.single("file"))
      // - notes: Optional notes about the report
      
      // For FormData uploads, let browser set Content-Type automatically (with boundary)
      // Increase timeout for large file uploads and processing
      const config = {
        timeout: 120000, // 2 minutes timeout for upload + processing
        headers: {
            'Content-Type': 'multipart/form-data',
        }
      };

      console.log('Making POST request to /report/upload');
      const response = await apiClient.post('/report/upload', formData, config);
      console.log('Upload response received:', response);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Report uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading report:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Upload is taking longer than expected. The file is still being processed. Please refresh to see the updated reports.');
      }
      if (error.message.includes('403')) {
        throw new Error('Only patients can upload reports');
      }
      if (error.message.includes('400') && error.message.includes('No file')) {
        throw new Error('Please select a PDF file to upload');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to upload reports');
      }
      throw new Error(error.message || 'Failed to upload report');
    }
  }

  async deleteReport(reportId) {
    try {
      const response = await apiClient.delete(`/report/${reportId}`);
      
      return {
        success: true,
        message: response.data.message || 'Report deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting report:', error);
      if (error.message.includes('404')) {
        throw new Error('Report not found');
      }
      if (error.message.includes('403')) {
        throw new Error('You do not have permission to delete this report');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to delete reports');
      }
      throw new Error(error.message || 'Failed to delete report');
    }
  }

  // Complete upload workflow with analysis and recommendations
  async uploadAndProcessReport(formData, onProgress) {
    try {
      // Step 1: Upload Report
      if (onProgress) onProgress('uploading', 'Uploading Report...');
      console.log('Step 1: Starting upload...');
      
      const uploadResponse = await this.uploadReport(formData);
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }
      
      const reportId = uploadResponse.data.report.id;
      console.log('Upload successful, Report ID:', reportId);
      
      // Step 2: Analyze Report
      if (onProgress) onProgress('analyzing', 'Analyzing the Report...');
      console.log('Step 2: Starting analysis...');

      const analysisResponse = await this.analyzeReport(reportId);
      console.log('Analysis response:', analysisResponse);
      if (!analysisResponse.success) {
        throw new Error(analysisResponse.message || 'Analysis failed');
      }
      
      const analyticsId = analysisResponse.data.analytics.id;
      console.log('Analysis successful, Analytics ID:', analyticsId);
      
      // Step 3: Generate Recommendations
      if (onProgress) onProgress('generating', 'Generating Recommendations...');
      console.log('Step 3: Generating recommendations...');
      
      const recommendationsResponse = await this.generateRecommendations(analyticsId);
      if (!recommendationsResponse.success) {
        throw new Error(recommendationsResponse.message || 'Recommendations generation failed');
      }
      
      console.log('Recommendations generated successfully');
      
      // Step 4: Complete
      if (onProgress) onProgress('completed', 'Report processed successfully!');
      
      return {
        success: true,
        data: {
          report: uploadResponse.data,
          analytics: analysisResponse.data,
          recommendations: recommendationsResponse.data
        },
        message: 'Report uploaded, analyzed, and recommendations generated successfully!'
      };
      
    } catch (error) {
      console.error('Error in upload and process workflow:', error);
      
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Processing is taking longer than expected. Please check back in a few minutes.');
      }
      
      throw error;
    }
  }

  // Analytics and AI Analysis methods
  async analyzeReport(reportId) {
    try {
      const response = await apiClient.post(`/report/${reportId}/analyze`);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Report analyzed successfully'
      };
    } catch (error) {
      console.error('Error analyzing report:', error);
      if (error.message.includes('404')) {
        throw new Error('Report not found');
      }
      if (error.message.includes('400') && error.message.includes('status')) {
        throw new Error('Report must be analyzed first (text extraction pending)');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to analyze reports');
      }
      throw new Error(error.message || 'Failed to analyze report');
    }
  }

  async getReportAnalytics(reportId) {
    try {
      const response = await apiClient.get(`/report/${reportId}/analytics`);
      console.log('Analytics response:', response);
      return {
        success: true,
        data: response.data,
        message: 'Analytics retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (error.message.includes('404') && error.message.includes('analytics')) {
        throw new Error('No analytics found for this report. Please analyze the report first.');
      }
      if (error.message.includes('404')) {
        throw new Error('Report not found');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to view analytics');
      }
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  }

  async generateRecommendations(analyticsId) {
    try {
      console.log('ReportService: Generating recommendations for analytics ID:', analyticsId);
      
      const response = await apiClient.post('/recommendation/health-recommendations', {
        analyticsId: analyticsId
      }, {
        timeout: 90000 // 90 seconds timeout for recommendation generation
      });
      
      console.log('ReportService: Recommendations response:', response);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Recommendations generated successfully'
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      if (error.message.includes('404')) {
        throw new Error('Analytics not found');
      }
      if (error.message.includes('400') && error.message.includes('diagnosis')) {
        throw new Error('No diagnosis found. Please analyze the report first.');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to generate recommendations');
      }
      throw new Error(error.message || 'Failed to generate recommendations');
    }
  }

  async getRecommendationByAnalytics(analyticsId) {
    try {
      console.log('ReportService: Fetching existing recommendations for analytics ID:', analyticsId);
      
      const response = await apiClient.get(`/recommendation/analytics/${analyticsId}`);
      
      console.log('ReportService: Get recommendations response:', response);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Recommendations retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      if (error.message.includes('404')) {
        throw new Error('No recommendations found for this analytics. Please generate recommendations first.');
      }
      if (error.message.includes('401')) {
        throw new Error('Please log in to view recommendations');
      }
      throw new Error(error.message || 'Failed to fetch recommendations');
    }
  }

  // Doctor methods - for viewing patient reports through bookings
  // Note: These methods would require additional backend endpoints
  async getPatientReportsForDoctor(patientId) {
    try {
      // This endpoint doesn't exist in backend yet
      // Would need: GET /api/doctor/patients/:patientId/reports
      console.warn('Doctor access to patient reports not implemented in backend yet');
      
      return {
        success: false,
        data: [],
        message: 'Doctor access to patient reports not yet implemented'
      };
    } catch (error) {
      console.error('Error fetching patient reports for doctor:', error);
      throw new Error('Failed to fetch patient reports');
    }
  }

  async getDoctorPatients() {
    try {
      // This would get patients who have appointments with this doctor
      // Endpoint doesn't exist in backend yet
      // Would need: GET /api/doctor/patients
      console.warn('Doctor patients endpoint not implemented in backend yet');
      
      return {
        success: false,
        data: [],
        message: 'Doctor patients endpoint not yet implemented'
      };
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      throw new Error('Failed to fetch patients');
    }
  }

  // Utility methods
  getStatusColor(status) {
    switch (status) {
      case 'uploaded': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'analyzed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusIcon(status) {
    // Return appropriate icons for each status
    const icons = {
      uploaded: 'FaUpload',
      processing: 'FaSpinner',
      analyzed: 'FaCheckCircle',
      failed: 'FaTimesCircle'
    };
    return icons[status] || 'FaFile';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  validateReportFile(file) {
    const errors = [];
    
    if (!file) {
      errors.push('Please select a file');
      return { isValid: false, errors };
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      errors.push('Only PDF files are allowed');
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Debug method to test API connectivity and auth
  async testApiConnection() {
    try {
      console.log('Testing API connection...');
      console.log('Current cookies:', document.cookie);
      console.log('API Base URL:', apiClient.client.defaults.baseURL);
      
      const response = await apiClient.get('/report/my-reports');
      console.log('Test response:', response);
      return response;
    } catch (error) {
      console.error('Test API error:', error);
      throw error;
    }
  }

  createFormData(file, notes = '') {
    console.log('Creating FormData with file:', file);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    const formData = new FormData();
    formData.append('file', file);  // Changed from 'reportFile' to 'file' to match backend
    if (notes.trim()) {
      formData.append('notes', notes.trim());
    }
    
    console.log('FormData created successfully');
    return formData;
  }
}

const reportService = new ReportService();
export default reportService;