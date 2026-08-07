import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Steps from './components/Steps'
import Features from './components/Features'
import Audience from './components/Audience'
import Ecosystem from './components/Ecosystem'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import LoginView from './components/auth/LoginView'
import RecoveryView from './components/auth/RecoveryView'
import ResetPasswordView from './components/auth/ResetPasswordView'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RegisterLayout from './components/layout/RegisterLayout'
import StepPersonalData from './components/registration/StepPersonalData'
import StepPayment from './components/registration/StepPayment'
import StepConfirmation from './components/registration/StepConfirmation'
import DashboardLayout from './components/dashboard/DashboardLayout'
import DevicesView from './components/dashboard/DevicesView'
import UsersView from './components/dashboard/UsersView'
import useAuthStore from './store/authStore'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Steps />
      <Features />
      <Audience />
      <Ecosystem />
      <Pricing />
      <Footer />
    </div>
  )
}

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginView />} />
        <Route path="/login/recuperar" element={<RecoveryView />} />
        <Route path="/login/restablecer" element={<ResetPasswordView />} />

        <Route path="/registro" element={<RegisterLayout />}>
          <Route index element={<Navigate to="cuenta" replace />} />
          <Route path="cuenta" element={<StepPersonalData />} />
          <Route path="pago" element={<StepPayment />} />
          <Route path="confirmacion" element={<StepConfirmation />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dispositivos" replace />} />
          <Route path="dispositivos" element={<DevicesView />} />
          <Route path="usuarios" element={<UsersView />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
