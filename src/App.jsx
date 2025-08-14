import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SimpleHeader from './components/SimpleHeader'
import NoticeBar from './components/NoticeBar'
import HeroSection from './components/HeroSection'
import LinkGrid from './components/LinkGrid'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import Analytics from './components/Analytics'
import { linksData } from './data/links'
import { ModalProvider } from './context/ModalContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useAnalytics } from './hooks/useAnalytics'

// ホームページコンポーネント
const HomePage = () => {
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    trackPageView({
      page_type: 'home',
      total_links: linksData.length
    })
  }, [trackPageView])

  return (
    <div className="min-h-screen bg-simple-pattern">
      <SimpleHeader />
      <NoticeBar />
      <HeroSection />
      <main>
        <LinkGrid links={linksData} />
      </main>
      <Footer />
    </div>
  )
}

// 保護されたルート（管理者のみアクセス可能）
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-simple-pattern flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <AdminLogin />
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  )
}

export default App
