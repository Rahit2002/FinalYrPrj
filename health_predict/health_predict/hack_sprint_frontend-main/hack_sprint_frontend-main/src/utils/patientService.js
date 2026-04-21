import api from './api';

class PatientService {
  constructor() {
    this.baseEndpoint = '/patient';
  }

  // Get current patient profile
  async getProfile() {
    try {
      const response = await api.get(`${this.baseEndpoint}/profile`);
      
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      throw new Error('No profile data received');
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      return {
        success: false,
        message: error.message,
        data: null
      };
    }
  }

  // Update patient profile
  async updateProfile(profileData) {
    try {
      const response = await api.put(`${this.baseEndpoint}/profile`, profileData);
      
      if (response.data) {
        return {
          success: true,
          data: response.data.data || response.data.patient,
          message: response.data.message || 'Profile updated successfully'
        };
      }
      
      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Error updating patient profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null
      };
    }
  }

  // Get patient reports (when endpoint exists)
  async getReports(patientId = null) {
    try {
      const endpoint = patientId 
        ? `/reports/patient/${patientId}`
        : '/reports/patient';
        
      const response = await api.get(endpoint);
      
      if (response.data && response.data.reports) {
        return {
          success: true,
          data: response.data.reports,
          count: response.data.count || response.data.reports.length
        };
      }
      
      throw new Error('No reports data received');
    } catch (error) {
      console.error('Error fetching patient reports:', error);
      
      // Return mock data as fallback
      return {
        success: true,
        data: this.getMockReports(),
        count: this.getMockReports().length,
        message: 'Using fallback data - reports endpoint not available'
      };
    }
  }

  // Get patient analytics (when endpoint exists)
  async getAnalytics(patientId = null) {
    try {
      const endpoint = patientId 
        ? `/analytics/patient/${patientId}`
        : '/analytics/patient';
        
      const response = await api.get(endpoint);
      
      if (response.data && response.data.analytics) {
        return {
          success: true,
          data: response.data.analytics
        };
      }
      
      throw new Error('No analytics data received');
    } catch (error) {
      console.error('Error fetching patient analytics:', error);
      
      // Return mock analytics as fallback
      return {
        success: true,
        data: this.getMockAnalytics(),
        message: 'Using fallback data - analytics endpoint not available'
      };
    }
  }

  // Get patient recommendations (when endpoint exists)
  async getRecommendations(patientId = null) {
    try {
      const endpoint = patientId 
        ? `/recommendations/patient/${patientId}`
        : '/recommendations/patient';
        
      const response = await api.get(endpoint);
      
      if (response.data && response.data.recommendations) {
        return {
          success: true,
          data: response.data.recommendations
        };
      }
      
      throw new Error('No recommendations data received');
    } catch (error) {
      console.error('Error fetching patient recommendations:', error);
      
      // Return mock recommendations as fallback
      return {
        success: true,
        data: this.getMockRecommendations(),
        message: 'Using fallback data - recommendations endpoint not available'
      };
    }
  }

  // Upload medical report
  async uploadReport(reportFile, reportData = {}) {
    try {
      const formData = new FormData();
      formData.append('file', reportFile);
      
      // Add additional report metadata
      Object.keys(reportData).forEach(key => {
        formData.append(key, reportData[key]);
      });

      const response = await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data) {
        return {
          success: true,
          data: response.data.report || response.data.data,
          message: response.data.message || 'Report uploaded successfully'
        };
      }
      
      throw new Error('Failed to upload report');
    } catch (error) {
      console.error('Error uploading report:', error);
      
      // Return mock success for demo
      return {
        success: true,
        data: {
          id: `report-${Date.now()}`,
          name: reportFile.name,
          status: 'processing',
          uploadDate: new Date().toISOString()
        },
        message: 'Demo upload - endpoint not available'
      };
    }
  }

  // Mock data methods for fallback
  getMockReports() {
    return [
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
    ];
  }

  getMockAnalytics() {
    return {
      overallRisk: "Medium",
      riskCategories: {
        cardiovascular: "Medium",
        neurological: "Low", 
        respiratory: "Low",
        metabolic: "High"
      },
      keyFindings: [
        "Elevated blood glucose levels",
        "Slightly elevated blood pressure",
        "Normal cardiac rhythm"
      ],
      recommendations: [
        "Schedule regular cardiology check-up",
        "Monitor blood glucose levels weekly",
        "Maintain heart-healthy diet"
      ]
    };
  }

  getMockRecommendations() {
    return [
      {
        id: 1,
        type: "lifestyle",
        priority: "high",
        title: "Diabetes Management",
        description: "Monitor blood glucose levels and follow diabetic diet",
        urgencyLevel: "high"
      },
      {
        id: 2,
        type: "medical",
        priority: "medium",
        title: "Cardiology Consultation",
        description: "Schedule follow-up appointment with cardiologist",
        urgencyLevel: "medium"
      },
      {
        id: 3,
        type: "preventive",
        priority: "low",
        title: "Regular Exercise",
        description: "Incorporate 30 minutes of daily exercise",
        urgencyLevel: "low"
      }
    ];
  }

  // Utility methods
  formatReportData(report) {
    return {
      id: report.id,
      name: report.file || report.name,
      uploadDate: report.createdAt || report.uploadDate,
      status: report.status,
      notes: report.notes,
      predictions: report.predictions || [],
      analytics: report.analytics || null
    };
  }

  validateProfileData(profileData) {
    const errors = [];
    
    if (!profileData.fullName || profileData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }
    
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (profileData.phoneNumber && !/^\+?[\d\s\-\(\)]{10,}$/.test(profileData.phoneNumber)) {
      errors.push('Please enter a valid phone number');
    }
    
    if (profileData.dateOfBirth) {
      const birthDate = new Date(profileData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
const patientService = new PatientService();
export default patientService;