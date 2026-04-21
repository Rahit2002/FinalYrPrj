# 🏥 AI Healthcare Platform - Frontend

A modern, AI-powered healthcare platform built with React and Vite, providing comprehensive medical services including disease prediction, emergency services, doctor consultations, and health monitoring.

## 🌟 Features

### 🤖 AI-Powered Health Analysis
- **Heart Disease Prediction**: Advanced cardiovascular health assessment
- **Neurological Analysis**: Early detection of neurological disorders
- **Vision Health Monitoring**: Eye disease prediction using computer vision
- **Respiratory Health**: Pulmonary function analysis and monitoring
- **Medical Report Analysis**: AI-powered insights and recommendations

### 👨‍⚕️ Healthcare Services
- **AI Chat Assistant**: 24/7 healthcare chatbot powered by Google Gemini AI
- **Doctor Consultations**: Book appointments with specialists
- **Emergency Services**: Real-time hospital finder with GPS integration
- **Patient Dashboard**: Comprehensive health tracking and history
- **Doctor Dashboard**: Patient management and analytics tools
- **Medical Reports**: Upload, analyze, and track health reports

### 🤖 AI Chat Assistant
- **24/7 Healthcare Support**: Always available intelligent assistant
- **Medical Query Processing**: Natural language understanding for health questions
- **Conversation History**: Persistent chat sessions with context awareness
- **Multi-Modal Interface**: Floating chat button and dedicated chat page
- **Export Conversations**: Download chat history for medical records

### 🚑 Emergency Features
- **Hospital Finder**: Google Maps integration for nearby hospitals
- **GPS Location**: Automatic location detection for emergency services
- **Emergency Contacts**: Direct calling to hospitals and emergency services
- **Real-time Data**: Live hospital information including wait times and availability

### 📊 Analytics & Insights
- **Health Trends**: Visual analytics and progress tracking
- **AI Recommendations**: Personalized health suggestions
- **Report Generation**: Comprehensive health summaries
- **Predictive Analytics**: Early warning systems for health conditions

## 🚀 Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom components
- **Animation**: Framer Motion for smooth animations
- **Icons**: React Icons library
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Build Tool**: Vite with Hot Module Replacement

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── bookings/       # Appointment booking components
│   ├── dashboard/      # Dashboard components
│   ├── reports/        # Medical reports components
│   └── ui/             # Base UI components
├── pages/              # Main application pages
│   ├── auth/           # Login/Signup pages
│   ├── dashboard/      # User dashboards
│   ├── HomePage.jsx    # Landing page
│   ├── EmergencyPage.jsx # Emergency services
│   └── ScheduleConsultationPage.jsx
├── utils/              # Utility functions and services
│   ├── api.js         # API client configuration
│   ├── hospitalService.js # Emergency services API
│   └── patientService.js  # Patient data management
├── context/            # React Context providers
├── hooks/              # Custom React hooks
└── fonts/              # Custom fonts and assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running on port 9191

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:9191/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🌐 Key Pages & Routes

- **`/`** - Landing page with platform overview
- **`/login`** - User authentication
- **`/signup`** - User registration
- **`/emergency`** - Emergency hospital finder
- **`/chat`** - Full-screen AI healthcare assistant
- **`/consultation`** - Doctor appointment booking
- **`/dashboard/patient`** - Patient dashboard
- **`/dashboard/doctor`** - Doctor dashboard
- **`/about`** - About the platform
- **`/contact`** - Contact information

## 🔌 API Integration

The frontend integrates with a Node.js/Express backend providing:

- **Authentication**: JWT-based user authentication
- **Hospital Services**: Google Places API for real hospital data
- **Medical Reports**: AI analysis and recommendations
- **Appointment Booking**: Doctor-patient scheduling system
- **Emergency Services**: Real-time hospital information

### API Configuration
```javascript
// Base API URL configuration
const API_BASE_URL = 'http://localhost:9191/api';

// Endpoints
/api/auth/*          - Authentication
/api/patient/*       - Patient services
/api/doctor/*        - Doctor services  
/api/hospital/*      - Emergency services
/api/chat/*          - AI chatbot services
/api/reports/*       - Medical reports
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Loading States**: Visual feedback for all async operations
- **Error Handling**: User-friendly error messages and retry options
- **Accessibility**: WCAG compliant components and navigation
- **Dark/Light Theme**: (Future enhancement)

## 🔐 Security Features

- **Protected Routes**: Authentication-based route protection
- **Secure API Calls**: Axios interceptors with error handling
- **Input Validation**: Client-side form validation
- **CORS Configuration**: Cross-origin resource sharing setup
- **Cookie Security**: Secure cookie handling for authentication

## 📱 Mobile Responsiveness

- Fully responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized images and assets
- Progressive Web App capabilities (Future enhancement)

## 🚀 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Optimized image loading and caching
- **Bundle Analysis**: Vite's built-in optimization
- **API Caching**: Efficient data fetching strategies
- **Lazy Loading**: Component and image lazy loading

## 🧪 Testing (Future Enhancement)

- Unit testing with Jest and React Testing Library
- Integration tests for API endpoints
- End-to-end testing with Cypress
- Component testing with Storybook

## 📈 Future Enhancements

- [ ] Progressive Web App (PWA) support
- [ ] Real-time notifications with WebSocket
- [ ] Offline functionality
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Video consultation integration
- [ ] Health data export features
- [ ] Integration with wearable devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🔄 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Connect GitHub repository for automatic deployments
- **Netlify**: Drag and drop build folder or Git integration
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Containerized deployment

---

Built with ❤️ using React + Vite for modern healthcare solutions.
