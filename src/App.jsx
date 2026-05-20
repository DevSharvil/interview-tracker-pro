import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ApplicationProvider } from './context/ApplicationContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications' 
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '10px', fontSize: '14px' },
            }}
          />
          <Routes>
            <Route path="/login"     element={<Login />} />
            <Route path="/signup"    element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}