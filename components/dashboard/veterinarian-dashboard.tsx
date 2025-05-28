"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, LogOut, Clock, Settings } from "lucide-react"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { MedicalHistory } from "@/components/medical/medical-history"
import { AppointmentStatusModal } from "@/components/appointments/appointment-status-modal"
import { appointmentService, petService } from "@/lib/api"

interface VeterinarianDashboardProps {
  user: any
  onLogout: () => void
}

export function VeterinarianDashboard({ user, onLogout }: VeterinarianDashboardProps) {
  const [activeTab, setActiveTab] = useState("citas")
  const [citas, setCitas] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [citasData, mascotasData] = await Promise.all([appointmentService.getAll(), petService.getAll()])
      setCitas(citasData)
      setMascotas(mascotasData)
    } catch (err: any) {
      setError(err.message || "Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appointmentId: number, status: string, observations?: string) => {
    try {
      await appointmentService.updateStatus(appointmentId, status, observations)
      await loadData() // Recargar datos después de actualizar
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      throw error
    }
  }

  const openStatusModal = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsStatusModalOpen(true)
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
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel Veterinario</h1>
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
            <TabsTrigger value="citas">Citas</TabsTrigger>
            <TabsTrigger value="mascotas">Mascotas</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="nueva-cita">Nueva Cita</TabsTrigger>
          </TabsList>

          <TabsContent value="citas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Citas</CardTitle>
                <CardDescription>Gestiona las citas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                {citas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay citas programadas</p>
                ) : (
                  <div className="space-y-4">
                    {citas.map((cita: any) => (
                      <div key={cita.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <Clock className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{cita.mascota?.nombre}</h3>
                            <p className="text-sm text-gray-600">Dueño: {cita.dueno?.nombre}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(cita.fecha_hora)} - {formatTime(cita.fecha_hora)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusBadgeColor(cita.estado)}>{cita.estado}</Badge>
                            {cita.estado === "programada" && (
                              <Button size="sm" variant="outline" onClick={() => openStatusModal(cita)}>
                                <Settings className="h-4 w-4 mr-1" />
                                Gestionar
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{cita.motivo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mascotas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Mascotas</CardTitle>
                <CardDescription>Información de todas las mascotas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                {mascotas.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay mascotas registradas</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {mascotas.map((mascota: any) => (
                      <Card key={mascota.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                              <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{mascota.nombre}</h3>
                              <p className="text-sm text-gray-600">
                                {mascota.especie} - {mascota.raza}
                              </p>
                              <p className="text-sm text-gray-600">{mascota.edad} años</p>
                              <p className="text-sm text-gray-600">Dueño: {mascota.dueno?.nombre}</p>
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

          <TabsContent value="historial">
            <MedicalHistory />
          </TabsContent>

          <TabsContent value="nueva-cita">
            <AppointmentForm userRole="veterinario" onSuccess={loadData} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal para gestionar estado de citas */}
      <AppointmentStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        appointment={selectedAppointment}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}
