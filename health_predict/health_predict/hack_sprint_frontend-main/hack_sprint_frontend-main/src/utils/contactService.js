import apiClient from './api.js';

class ContactService {
  /**
   * Submit contact form
   */
  async submitContactForm(contactData) {
    try {
      console.log('ContactService: Submitting contact form...');
      console.log('Contact data:', contactData);
      
      const response = await apiClient.post('/contact/submit', contactData);
      
      console.log('Contact form submission response:', response);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Contact form submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting contact form:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Please check your form data and try again');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to submit contact form');
    }
  }

  /**
   * Get all contacts (Admin only - for future use)
   */
  async getAllContacts(status = null) {
    try {
      console.log('ContactService: Fetching all contacts...');
      
      const params = status ? { status } : {};
      const response = await apiClient.get('/contact/all', { params });
      
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        message: response.data.message || 'Contacts retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please log in to access this feature');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this feature');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch contacts');
    }
  }

  /**
   * Get contact by ID (Admin only - for future use)
   */
  async getContactById(contactId) {
    try {
      console.log(`ContactService: Fetching contact with ID: ${contactId}`);
      
      const response = await apiClient.get(`/contact/${contactId}`);
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Contact retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Contact not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Please log in to access this feature');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to access this feature');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch contact');
    }
  }

  /**
   * Create form data helper
   */
  createContactFormData(formData) {
    return {
      fullName: formData.name || formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject,
      message: formData.message
    };
  }

  /**
   * Validate form data
   */
  validateContactForm(formData) {
    const errors = {};

    // Required fields
    if (!formData.name?.trim()) {
      errors.name = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject?.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message?.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    // Optional phone validation
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Export singleton instance
const contactService = new ContactService();
export default contactService;