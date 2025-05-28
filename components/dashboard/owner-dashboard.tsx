"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, LogOut, Clock } from "lucide-react"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { PetRegistrationForm } from "@/components/pets/pet-registration-form"
import { appointmentService, petService } from "@/lib/api"

interface OwnerDashboardProps {
  user: any
  onLogout: () => void
}

export function OwnerDashboard({ user, onLogout }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState("mis-mascotas")
  const [misMascotas, setMisMascotas] = useState([])
  const [misCitas, setMisCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [mascotasData, citasData] = await Promise.all([petService.getAll(), appointmentService.getAll()])
      setMisMascotas(mascotasData)
      setMisCitas(citasData)
    } catch (err: any) {
      setError(err.message || "Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "programada":
        return "bg-blue-100 text-blue-800"
      case "completada":
        return "bg-green-100 text-green-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadData}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user.nombre}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mis-mascotas">Mis Mascotas</TabsTrigger>
            <TabsTrigger value="mis-citas">Mis Citas</TabsTrigger>
            <TabsTrigger value="nueva-cita">Agendar Cita</TabsTrigger>
            <TabsTrigger value="registrar-mascota">Registrar Mascota</TabsTrigger>
          </TabsList>

          <TabsContent value="mis-mascotas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Mascotas</CardTitle>
                <CardDescription>Información de tus mascotas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                {misMascotas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tienes mascotas registradas</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {misMascotas.map((mascota: any) => (
                      <Card key={mascota.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                              <Heart className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{mascota.nombre}</h3>
                              <p className="text-sm text-gray-600">
                                {mascota.especie} - {mascota.raza}
                              </p>
                              <p className="text-sm text-gray-600">
                                {mascota.edad} años - {mascota.peso} kg
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mis-citas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Citas</CardTitle>
                <CardDescription>Citas programadas para tus mascotas</CardDescription>
              </CardHeader>
              <CardContent>
                {misCitas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tienes citas programadas</p>
                ) : (
                  <div className="space-y-4">
                    {misCitas.map((cita: any) => (
                      <div key={cita.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                            <Clock className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cita.mascota?.nombre}</h3>
                            <p className="text-sm text-gray-600">Veterinario: {cita.veterinario?.nombre}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(cita.fecha_hora)} - {formatTime(cita.fecha_hora)}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeColor(cita.estado)}>{cita.estado}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nueva-cita">
            <AppointmentForm userRole="dueno" onSuccess={loadData} />
          </TabsContent>

          <TabsContent value="registrar-mascota">
            <PetRegistrationForm onSuccess={loadData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
