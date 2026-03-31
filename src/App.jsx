import React, { Suspense, lazy, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { useMotionSettings } from './utils/motion'
import RouteSeo from './components/RouteSeo'
import LoadingPage from './components/LoadingPage'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AdminProjectsPage = lazy(() => import('./pages/AdminProjectsPage'))
const AdminToursPage = lazy(() => import('./pages/AdminToursPage'))
const AdminContactsPage = lazy(() => import('./pages/AdminContactsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const PageShell = ({ children, settings }) => (
  <motion.div
    initial={{ opacity: 0, y: settings.prefersReduced ? 6 : settings.isMobile ? 10 : 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: settings.prefersReduced ? -4 : settings.isMobile ? -8 : -12 }}
    transition={{ duration: settings.duration, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  const location = useLocation()
  const motionSettings = useMotionSettings()

  return (
    <MotionConfig reducedMotion='user'>
      <AuthProvider>
        <div className='w-full overflow-hidden'>
          <ScrollToTop />
          <RouteSeo />
          <ToastContainer />
          <Suspense fallback={<LoadingPage />}>
            <AnimatePresence mode='wait'>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageShell settings={motionSettings}><HomePage /></PageShell>} />
                <Route path="/about" element={<PageShell settings={motionSettings}><AboutPage /></PageShell>} />
                <Route path="/events" element={<PageShell settings={motionSettings}><EventsPage /></PageShell>} />
                <Route path="/properties" element={<PageShell settings={motionSettings}><ProjectsPage /></PageShell>} />
                <Route path="/property/:id" element={<PageShell settings={motionSettings}><ProjectDetail /></PageShell>} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/properties" element={<ProtectedRoute><AdminProjectsPage /></ProtectedRoute>} />
                <Route path="/admin/tours" element={<ProtectedRoute><AdminToursPage /></ProtectedRoute>} />
                <Route path="/admin/contacts" element={<ProtectedRoute><AdminContactsPage /></ProtectedRoute>} />
                <Route path="/contact" element={<PageShell settings={motionSettings}><ContactPage /></PageShell>} />
                <Route path="/privacy-policy" element={<PageShell settings={motionSettings}><PrivacyPolicyPage /></PageShell>} />
                <Route path="*" element={<PageShell settings={motionSettings}><NotFoundPage /></PageShell>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </div>
      </AuthProvider>
    </MotionConfig>
  )
}

export default App