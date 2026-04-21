import { motion } from 'framer-motion';
import { 
  FaHeartbeat, 
  FaBrain, 
  FaEye, 
  FaLungs, 
  FaUserMd, 
  FaUpload, 
  FaChartLine, 
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaUsers
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: FaHeartbeat,
      title: "Heart Disease Prediction",
      description: "Advanced AI algorithms analyze your cardiovascular health data to predict potential heart conditions.",
      color: "bg-pink-500"
    },
    {
      icon: FaBrain,
      title: "Neurological Analysis",
      description: "Early detection of neurological disorders through comprehensive brain health assessment.",
      color: "bg-green-500"
    },
    {
      icon: FaEye,
      title: "Vision Health Monitoring",
      description: "Eye disease prediction using retinal imaging and advanced computer vision technology.",
      color: "bg-blue-500"
    },
    {
      icon: FaLungs,
      title: "Respiratory Health",
      description: "Pulmonary function analysis to detect early signs of respiratory conditions.",
      color: "bg-green-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Patients Served", icon: FaUsers },
    { number: "95%", label: "Accuracy Rate", icon: FaCheckCircle },
    { number: "24/7", label: "AI Monitoring", icon: FaClock },
    { number: "50+", label: "Disease Types", icon: FaChartLine }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      rating: 5,
      comment: "HealthPredict detected early signs of heart disease that my regular checkups missed. It saved my life!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      rating: 5,
      comment: "The AI predictions are incredibly accurate. It's revolutionizing how we approach preventive medicine.",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Patient",
      rating: 5,
      comment: "The dashboard is intuitive and the predictions helped me make informed health decisions early.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-pink-500 opacity-5"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Left Text Content */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-left"
            >
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
              >
                Predict Your Health,
                <span className="text-pink-600"> Prevent Disease</span>
              </motion.h1>
              
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Revolutionary AI-powered healthcare platform that analyzes your medical reports to predict potential diseases before they become critical. Take control of your health journey today.
              </motion.p>

              {/* Key Features List */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-3 mb-8"
              >
                <div className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="font-medium">AI-powered disease prediction with 95% accuracy</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="font-medium">HIPAA compliant and secure data handling</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="font-medium">Expert medical professionals available 24/7</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Health Image */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                {/* Background Decorations */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-200 rounded-full opacity-60 animate-pulse delay-300"></div>
                <div className="absolute top-1/2 -left-12 w-16 h-16 bg-blue-200 rounded-full opacity-60 animate-pulse delay-500"></div>
                
                {/* Main Health Image */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=500&fit=crop&crop=center"
                    alt="Healthcare Professional with Digital Health Technology"
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                  
                  {/* Floating Health Stats */}
                  <motion.div 
                    className="absolute -top-4 -right-4 bg-pink-500 text-white p-3 rounded-xl shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <FaHeartbeat className="text-xl mb-1" />
                    <p className="text-xs font-bold">95% Accuracy</p>
                  </motion.div>

                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-xl shadow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                  >
                    <FaShieldAlt className="text-xl mb-1" />
                    <p className="text-xs font-bold">HIPAA Secure</p>
                  </motion.div>

                  <motion.div 
                    className="absolute top-1/2 -right-6 bg-blue-500 text-white p-3 rounded-xl shadow-lg"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.8, delay: 1 }}
                  >
                    <FaBrain className="text-xl mb-1" />
                    <p className="text-xs font-bold">AI Powered</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center"
              >
                Get Started as Patient
                <FaArrowRight className="ml-2" />
              </motion.button>
            </Link>
            
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-500 hover:border-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <p className='text-green-500'>Join as Doctor</p>
                <FaUserMd className="ml-2 text-green-500" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Advanced Disease Prediction</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI technology analyzes multiple health parameters to provide accurate predictions across various medical domains
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`flex items-center justify-center w-16 h-16 ${feature.color} rounded-full mb-6 mx-auto`}>
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-blue-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to revolutionize your healthcare</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6 mx-auto">
                <FaUpload className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Upload Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Securely upload your medical reports, lab results, and health data to our HIPAA-compliant platform.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-pink-500 rounded-full mb-6 mx-auto">
                <FaBrain className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">2. AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced machine learning algorithms analyze your data using the latest medical research and patterns.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 mx-auto">
                <FaChartLine className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">3. Get Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed health predictions, risk assessments, and personalized recommendations for prevention.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl p-12 text-gray-700 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Trusted by Healthcare Professionals</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="text-4xl mb-4 mx-auto opacity-90" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-green-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real stories from patients and doctors</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">{testimonial.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of patients and doctors who are already using AI-powered disease prediction to save lives and improve health outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start Your Health Journey
              </motion.button>
            </Link>
            
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-500 hover:border-green-600 text-green-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;