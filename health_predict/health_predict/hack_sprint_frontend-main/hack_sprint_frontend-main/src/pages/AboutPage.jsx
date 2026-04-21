import React from "react";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaHeart,
  FaBrain,
  FaEye,
  FaStethoscope,
  FaAward,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import { div } from "framer-motion/client";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "15+ years",
      icon: FaHeart,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
      description:
        "Specialized in heart disease prediction and prevention with advanced AI diagnostics.",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "12+ years",
      icon: FaBrain,
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
      description:
        "Expert in neurological disorders and brain health monitoring using machine learning.",
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Ophthalmologist",
      experience: "10+ years",
      icon: FaEye,
      image:
        "https://images.unsplash.com/photo-1594824483764-e446e04023c8?w=300&h=300&fit=crop&crop=face",
      description:
        "Pioneer in early eye disease detection through AI-powered retinal analysis.",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "General Physician",
      experience: "18+ years",
      icon: FaStethoscope,
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face",
      description:
        "Comprehensive healthcare with focus on preventive medicine and early diagnosis.",
    },
  ];

  const clinicFeatures = [
    {
      icon: FaShieldAlt,
      title: "Advanced Security",
      description:
        "Your health data is protected with enterprise-grade security and encryption.",
    },
    {
      icon: FaUsers,
      title: "Patient-Centered Care",
      description:
        "Personalized healthcare solutions tailored to your unique health profile.",
    },
    {
      icon: FaAward,
      title: "Award-Winning Technology",
      description:
        "Cutting-edge AI technology for accurate disease prediction and diagnosis.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 text-center bg-pink-600 text-white"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <p className="text-amber-100">About HealthPredict Clinic</p>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
          >
            Pioneering the future of healthcare with AI-powered disease
            prediction and personalized patient care
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At HealthPredict Clinic, we revolutionize healthcare by combining
              cutting-edge artificial intelligence with compassionate medical
              expertise to predict, prevent, and treat diseases before they
              become critical.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {clinicFeatures.map((feature, index) => (
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition duration-400 ">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6 mx-auto">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Doctors Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-blue-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Meet Our Expert Doctors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of specialists combines years of medical expertise with
              advanced AI technology to provide you with the most accurate
              health predictions and treatments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-100"
              >
                <div className="relative mb-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-blue-400 to-teal-400"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2">
                    <doctor.icon className="text-white text-lg" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {doctor.experience}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {doctor.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Our Technology
          </h2>
          <div className="bg-green-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-6">
              AI-Powered Disease Prediction
            </h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              Our advanced machine learning algorithms analyze your health
              reports to predict potential diseases with remarkable accuracy.
              Early detection saves lives, and our technology makes it possible.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-lg opacity-90">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-lg opacity-90">AI Monitoring</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">Disease Types</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      {localStorage.getItem("userType") == "patient" && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 px-4 bg-green-50"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust HealthPredict Clinic for
              their healthcare needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Link to={'/schedule-consultation'}>Schedule Consultation</Link>
            </motion.button>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default AboutPage;
