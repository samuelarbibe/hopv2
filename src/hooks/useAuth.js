import React, { useContext, createContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  const login = async (username, password) => {
    setIsLoading(true)
    setTouched(true)
    try {
      const { data } = await axios.post('/api/users/login', { username, password })
      setIsAuth(data.authenticated)
    } catch (error) {
      setIsAuth(false)
    }
    setIsLoading(false)
  }

  const checkIsAuth = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get('/api/users/login')
      setIsAuth(data.authenticated)
    } catch (error) {
      setIsAuth(false)
    }
    setIsLoading(false)
  }

  const value = { isAuth, login, checkIsAuth, isLoading, touched }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
export { AuthProvider, useAuth }