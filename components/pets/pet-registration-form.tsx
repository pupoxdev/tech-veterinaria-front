"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Plus } from "lucide-react"
import { petService } from "@/lib/api"

interface PetRegistrationFormProps {
  onSuccess?: () => void
}

export function PetRegistrationForm({ onSuccess }: PetRegistrationFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    peso: "",
    color: "",
  })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await petService.create({
        ...formData,
        edad: formData.edad ? Number.parseInt(formData.edad) : null,
        peso: formData.peso ? Number.parseFloat(formData.peso) : null,
      })

      setSuccess(true)
      setFormData({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        peso: "",
        color: "",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("Error al registrar mascota:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-blue-600" />
          <CardTitle>Registrar Nueva Mascota</CardTitle>
        </div>
        <CardDescription>Agrega una nueva mascota a tu perfil</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4">
            <AlertDescription>¡Mascota registrada exitosamente!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la mascota</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Max, Luna, Rocky..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="especie">Especie</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, especie: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="ave">Ave</SelectItem>
                  <SelectItem value="conejo">Conejo</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="raza">Raza</Label>
              <Input
                id="raza"
                value={formData.raza}
                onChange={(e) => setFormData({ ...formData, raza: e.target.value })}
                placeholder="Ej: Golden Retriever, Siamés..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edad">Edad (años)</Label>
              <Input
                id="edad"
                type="number"
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                placeholder="Ej: 3"
                min="0"
                max="30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                placeholder="Ej: 25.5"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="Ej: Dorado, Blanco y negro..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Registrando..." : "Registrar Mascota"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
