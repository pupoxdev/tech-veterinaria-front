"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock } from "lucide-react"
import { appointmentService, petService, veterinarianService } from "@/lib/api"

interface AppointmentFormProps {
  userRole: "veterinario" | "dueno"
  onSuccess?: () => void
}

export function AppointmentForm({ userRole, onSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    mascotaId: "",
    veterinarioId: "",
    fecha: "",
    hora: "",
    motivo: "",
  })
  const [mascotas, setMascotas] = useState([])
  const [veterinarios, setVeterinarios] = useState([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [mascotasData, veterinariosData] = await Promise.all([petService.getAll(), veterinarianService.getAll()])
      setMascotas(mascotasData)
      setVeterinarios(veterinariosData)
    } catch (err: any) {
      setError(err.message || "Error al cargar datos")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const fechaHora = new Date(`${formData.fecha}T${formData.hora}:00`)

      await appointmentService.create({
        mascota_id: Number.parseInt(formData.mascotaId),
        veterinario_id: formData.veterinarioId ? Number.parseInt(formData.veterinarioId) : undefined,
        fecha_hora: fechaHora.toISOString(),
        motivo: formData.motivo,
      })

      setSuccess(true)
      setFormData({
        mascotaId: "",
        veterinarioId: "",
        fecha: "",
        hora: "",
        motivo: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || "Error al agendar cita")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          <CardTitle>Agendar Nueva Cita</CardTitle>
        </div>
        <CardDescription>
          {userRole === "veterinario" ? "Programa una cita para cualquier mascota" : "Agenda una cita para tu mascota"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4">
            <AlertDescription>¡Cita agendada exitosamente!</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mascota">Mascota</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, mascotaId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una mascota" />
              </SelectTrigger>
              <SelectContent>
                {mascotas.map((mascota: any) => (
                  <SelectItem key={mascota.id} value={mascota.id.toString()}>
                    {mascota.nombre} {userRole === "veterinario" && `(${mascota.dueno?.nombre})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {userRole === "dueno" && (
            <div className="space-y-2">
              <Label htmlFor="veterinario">Veterinario</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, veterinarioId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un veterinario" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarios.map((vet: any) => (
                    <SelectItem key={vet.id} value={vet.id.toString()}>
                      {vet.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de la consulta</Label>
            <Textarea
              id="motivo"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Describe el motivo de la consulta..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Clock className="h-4 w-4 mr-2" />
            {loading ? "Agendando..." : "Agendar Cita"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
