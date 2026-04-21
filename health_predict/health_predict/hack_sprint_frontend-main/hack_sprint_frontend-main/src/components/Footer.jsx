import { motion } from 'framer-motion';
import {
  FaHeart,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaShieldAlt,
  FaUserMd,
  FaPlusCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Patient Portal', path: '/login?role=patient' },
    { name: 'Doctor Portal', path: '/login?role=doctor' },
  ];

  const services = [
    'Disease Prediction',
    'Health Analytics',
    'Medical Reports',
    'AI Diagnostics',
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: 'https://www.facebook.com', label: 'Facebook' },
    { icon: FaTwitter, href: 'https://www.twitter.com', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://www.instagram.com', label: 'Instagram' },
    { icon: FaLinkedinIn, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <motion.footer
      className="relative overflow-hidden bg-pink-900 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      aria-labelledby="footer-heading"
    >
      {/* subtle decorative orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-8">
        <div className="absolute -left-16 -top-10 w-44 h-44 bg-pink-600 rounded-full blur-3xl opacity-20" />
        <div className="absolute -right-12 bottom-8 w-56 h-56 bg-teal-600 rounded-full blur-3xl opacity-18" />
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-36 h-36 bg-indigo-600 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand / About */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-full">
                <FaPlusCircle className="text-white text-xl" aria-hidden size={30} />
              </div>
              <div>
                <h2 id="footer-heading" className="text-2xl sm:text-3xl font-extrabold leading-tight ">
                  <span className="text-white">Health</span>
                  <span className="text-blue-400">Predict</span>
                </h2>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-5 text-sm sm:text-base">
              Pioneering AI-powered healthcare for early disease prediction and better patient outcomes.
            </p>

            <div className="inline-flex items-center gap-3 bg-white/6 px-3 py-2 rounded-lg">
              <FaShieldAlt className="text-green-300" aria-hidden />
              <span className="text-sm text-gray-100 font-medium">HIPAA Compliant & Secure</span>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-white pb-2 inline-block"><span className='text-white'>Quick Links</span></h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li key={i} whileHover={{ x: 6 }} className="list-none">
                  <Link
                    to={link.path}
                    className="flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
                  >
                    <span className="w-2.5 h-2.5 bg-white rounded-full opacity-90" aria-hidden />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white pb-2 inline-block"><span className='text-white'>Our Services</span></h3>
            <ul className="mt-4 space-y-3">
              {services.map((s, i) => (
                <motion.li
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-600/20 flex items-center justify-center">
                    <FaUserMd className="text-teal-300" aria-hidden />
                  </div>
                  <span className="text-sm">{s}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white pb-2 inline-block"><span className='text-white'>Contact Info</span></h3>
            <address className="not-italic mt-4 space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-300" aria-hidden />
                </div>
                <div>
                  <div className="font-medium text-sm text-white">IIEST Shibpur</div>
                  <div className="text-xs">College Road, Howrah-711103</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="text-blue-300" aria-hidden />
                </div>
                <a href="tel:+15551234567" className="text-sm text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">
                  +91 12345 67890
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-blue-300" aria-hidden />
                </div>
                <a href="mailto:support@healthpredict.com" className="text-sm text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">
                  support@healthpredict.com
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-pink-400 border-opacity-20 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-300 text-sm">
              <div className="font-medium">&copy; 2025 HealthPredict Clinic. All rights reserved.</div>
              <div className="mt-1 text-xs flex items-center">
                Designed with <FaHeart className="inline-block text-white mx-2 animate-pulse" /> for better healthcare
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* social */}
              <div className="flex gap-3">
                {socialLinks.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      whileHover={{ scale: 1.15, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center border border-white focus:outline-none focus:ring-white"
                    >
                      <Icon className="text-sm md:text-md lg:text-lg" />
                    </motion.a>
                  );
                })}
              </div>

              {/* legal */}
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-300 hover:text-teal-300 transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors">HIPAA Compliance</a>
                <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
