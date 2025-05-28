"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface AppointmentStatusModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
  onUpdateStatus: (appointmentId: number, status: string, observations?: string) => Promise<void>
}

export function AppointmentStatusModal({ isOpen, onClose, appointment, onUpdateStatus }: AppointmentStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("")
  const [observations, setObservations] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return

    setLoading(true)
    try {
      await onUpdateStatus(appointment.id, selectedStatus, observations)
      onClose()
      setSelectedStatus("")
      setObservations("")
    } catch (error) {
      console.error("Error al actualizar estado:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    {
      value: "completada",
      label: "Completada",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      description: "La cita se realizó exitosamente",
    },
    {
      value: "cancelada",
      label: "Cancelada",
      icon: XCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      description: "La cita fue cancelada",
    },
  ]

  if (!appointment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Estado de Cita</DialogTitle>
          <DialogDescription>
            Cita de {appointment.mascota?.nombre} - {appointment.dueno?.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">
              Estado actual: {appointment.estado}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label>Nuevo estado:</Label>
            {statusOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedStatus === option.value ? option.color : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedStatus(option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones (opcional):</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Agregar observaciones sobre la cita..."
              rows={3}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button onClick={handleUpdateStatus} disabled={!selectedStatus || loading} className="flex-1">
              {loading ? "Actualizando..." : "Actualizar Estado"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
