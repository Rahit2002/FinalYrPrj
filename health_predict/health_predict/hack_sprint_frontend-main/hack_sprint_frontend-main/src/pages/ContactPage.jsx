import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaHeart,
  FaUserMd,
  FaCalendarAlt,
  FaComments,
  FaPaperPlane,
  FaCheckCircle,
  FaQuestionCircle,
  FaHeadset,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import MapEmbed from "../components/ui/MapCard";
import NotificationContainer from "../components/ui/NotificationContainer";
import useNotification from "../hooks/useNotification";
import contactService from "../utils/contactService";

const ContactPage = () => {
  const {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    userType: "patient",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Validate form
    const validation = contactService.validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      showError("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting contact form:", formData);

      // Prepare contact data for backend
      const contactData = contactService.createContactFormData(formData);

      // Submit to backend
      const response = await contactService.submitContactForm(contactData);

      console.log("Contact form submission successful:", response);

      // Show success message
      showSuccess(
        "Thank you for contacting us! We have received your message and will get back to you soon."
      );

      // Set submitted state and reset form
      setIsSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          userType: "patient",
        });
      }, 5000); // Show success state for 5 seconds
    } catch (error) {
      console.error("Contact form submission failed:", error);
      showError(
        error.message || "Failed to submit contact form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Our Clinic",
      details: [
        "123 Healthcare Avenue",
        "Medical District, MD 12345",
        "United States",
      ],
      color: "bg-pink-500",
    },
    {
      icon: FaPhoneAlt,
      title: "Call Us",
      details: ["+1 (555) 123-HEALTH", "+1 (555) 456-7890", "Emergency: 911"],
      color: "bg-green-500",
    },
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: [
        "support@healthpredict.com",
        "appointments@healthpredict.com",
        "research@healthpredict.com",
      ],
      color: "bg-blue-500",
    },
    {
      icon: FaClock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 8:00 PM",
        "Saturday: 9:00 AM - 5:00 PM",
        "Sunday: Emergency Only",
      ],
      color: "bg-pink-600",
    },
  ];

  const quickActions = [
    {
      icon: FaCalendarAlt,
      title: "Schedule Consultation",
      description: "Book an appointment with our medical experts",
      action: "Schedule Now",
      link: "/schedule-consultation",
      color: "bg-pink-500",
    },
    {
      icon: FaUserMd,
      title: "Find a Doctor",
      description: "Browse our network of specialized physicians",
      action: "Browse Doctors",
      link: "/about#doctors",
      color: "bg-green-500",
    },
  ];

  const faqs = [
    {
      question: "How accurate are your AI predictions?",
      answer:
        "Our AI system has achieved 95% accuracy in disease prediction through extensive training on medical datasets and validation by healthcare professionals.",
    },
    {
      question: "Is my medical data secure?",
      answer:
        "Yes, we use enterprise-grade encryption and are fully HIPAA compliant. Your data is anonymized for research and never shared without consent.",
    },
    {
      question: "How long does report analysis take?",
      answer:
        "Most reports are analyzed within 2-5 minutes. Complex cases may take up to 15 minutes for thorough analysis.",
    },
    {
      question: "Can I schedule consultations online?",
      answer:
        "Yes, you can schedule consultations through our platform. We offer both in-person and telemedicine appointments.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-pink-600 text-white py-20 px-4 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaComments className="text-4xl text-gray-700" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get in touch with our healthcare experts. We're here to help you
            with any questions about our AI-powered healthcare solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center bg-white text-gray-700 bg-opacity-20 px-4 py-2 rounded-full">
              <FaCheckCircle className="mr-2" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center bg-white text-gray-700 bg-opacity-20 px-4 py-2 rounded-full">
              <FaCheckCircle className="mr-2" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center bg-white text-gray-700 bg-opacity-20 px-4 py-2 rounded-full">
              <FaCheckCircle className="mr-2" />
              <span>Expert Team</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      {localStorage.getItem("userType") != "doctor" && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 px-4 -mt-10 relative z-10"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mt-6 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center"
                >
                  <div
                    className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <action.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{action.description}</p>
                  <Link to={action.link}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full ${action.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                    >
                      {action.action}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section> 
      )}

      {/* Contact Information */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach our healthcare team. Choose what works best
              for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100"
              >
                <div
                  className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <info.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form and Map */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700">
                    Thank you for contacting us. We'll get back to you within 24
                    hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* User Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      I am a:
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="userType"
                          value="patient"
                          checked={formData.userType === "patient"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                        />
                        <span className="ml-2 text-gray-700">Patient</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="userType"
                          value="doctor"
                          checked={formData.userType === "doctor"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700">
                          Healthcare Professional
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          formErrors.name
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Your full name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          formErrors.email
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          formErrors.phone
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                          formErrors.subject
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a subject</option>
                        <option value="appointment">
                          Schedule Appointment
                        </option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="partnership">
                          Partnership Opportunity
                        </option>
                        <option value="research">Research Collaboration</option>
                        <option value="other">Other</option>
                      </select>
                      {formErrors.subject && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
                        formErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-pink-600 hover:bg-pink-700 hover:shadow-lg'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Map and Additional Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Find Our Location
              </h2>

              <MapEmbed />

              {/* FAQ Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start">
                        <FaQuestionCircle className="text-pink-500 mt-1 mr-3 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Notification Container */}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />

    </div>
  );
};

export default ContactPage;
