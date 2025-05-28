"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { VeterinarianDashboard } from "@/components/dashboard/veterinarian-dashboard"
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard"
import { authService } from "@/lib/api"

export default function Home() {
  const [currentView, setCurrentView] = useState<"login" | "register" | "vet-dashboard" | "owner-dashboard">("login")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la página
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      if (currentUser.rol === "veterinario") {
        setCurrentView("vet-dashboard")
      } else {
        setCurrentView("owner-dashboard")
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    if (userData.rol === "veterinario") {
      setCurrentView("vet-dashboard")
    } else {
      setCurrentView("owner-dashboard")
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setCurrentView("login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "login" && (
        <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
      )}
      {currentView === "register" && (
        <RegisterForm onRegister={handleLogin} onSwitchToLogin={() => setCurrentView("login")} />
      )}
      {currentView === "vet-dashboard" && <VeterinarianDashboard user={user} onLogout={handleLogout} />}
      {currentView === "owner-dashboard" && <OwnerDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}
