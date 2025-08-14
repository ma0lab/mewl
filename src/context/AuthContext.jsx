import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 管理者パスワード（環境変数から取得、デフォルトなし）
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    // ページ読み込み時にログイン状態をチェック
    const authStatus = localStorage.getItem('mewl-admin-auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (password) => {
    // 環境変数が設定されていない場合はログイン不可
    if (!ADMIN_PASSWORD) {
      console.warn('Admin password not configured')
      return false
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('mewl-admin-auth', 'authenticated')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('mewl-admin-auth')
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}