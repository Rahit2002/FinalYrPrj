import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import EmergencyPage from './pages/EmergencyPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'
import PatientDashboard from './pages/dashboard/PatientDashboard.jsx'
import DoctorDashboard from './pages/dashboard/DoctorDashboard.jsx'
import ProfileHolder from './components/ProfileHolder.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ScheduleConsultationPage from './pages/ScheduleConsultationPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/emergency',
        element: <EmergencyPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/patient-dashboard',
        element: (
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/doctor-dashboard',
        element: (
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfileHolder />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/schedule-consultation',
        element: (
          <ProtectedRoute>
            <ScheduleConsultationPage />
          </ProtectedRoute>
        ),
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
