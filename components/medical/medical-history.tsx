"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search } from "lucide-react"
import { medicalService, petService } from "@/lib/api"

export function MedicalHistory() {
  const [selectedPet, setSelectedPet] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    diagnostico: "",
    tratamiento: "",
    medicamentos: "",
    observaciones: "",
    peso: "",
    temperatura: "",
  })

  const [mascotas, setMascotas] = useState([])
  const [historialMedico, setHistorialMedico] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    try {
      const data = await petService.getAll()
      setMascotas(data)
    } catch (error) {
      console.error("Error al cargar mascotas:", error)
    }
  }

  const loadHistory = async (petId: string) => {
    try {
      setLoading(true)
      const data = await medicalService.getHistory(petId)
      setHistorialMedico(data)
    } catch (error) {
      console.error("Error al cargar historial:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePetSelect = (petId: string) => {
    setSelectedPet(petId)
    if (petId) {
      loadHistory(petId)
    } else {
      setHistorialMedico([])
    }
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await medicalService.createRecord({
        mascota_id: Number.parseInt(selectedPet),
        fecha: new Date().toISOString().split("T")[0],
        ...newRecord,
        peso_actual: newRecord.peso ? Number.parseFloat(newRecord.peso) : null,
        temperatura: newRecord.temperatura ? Number.parseFloat(newRecord.temperatura) : null,
      })

      setShowAddForm(false)
      setNewRecord({
        diagnostico: "",
        tratamiento: "",
        medicamentos: "",
        observaciones: "",
        peso: "",
        temperatura: "",
      })

      if (selectedPet) {
        loadHistory(selectedPet)
      }
    } catch (error) {
      console.error("Error al crear registro:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <CardTitle>Historial Médico</CardTitle>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Registro
            </Button>
          </div>
          <CardDescription>Consulta y gestiona el historial médico de las mascotas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="pet-select">Seleccionar mascota</Label>
                <Select onValueChange={handlePetSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Buscar mascota..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mascotas.map((mascota: any) => (
                      <SelectItem key={mascota.id} value={mascota.id.toString()}>
                        {mascota.nombre} - {mascota.dueno?.nombre || "Sin dueño"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {showAddForm && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Registro Médico</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddRecord} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="peso">Peso (kg)</Label>
                        <Input
                          id="peso"
                          type="number"
                          step="0.1"
                          value={newRecord.peso}
                          onChange={(e) => setNewRecord({ ...newRecord, peso: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperatura">Temperatura (°C)</Label>
                        <Input
                          id="temperatura"
                          type="number"
                          step="0.1"
                          value={newRecord.temperatura}
                          onChange={(e) => setNewRecord({ ...newRecord, temperatura: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnostico">Diagnóstico</Label>
                      <Textarea
                        id="diagnostico"
                        value={newRecord.diagnostico}
                        onChange={(e) => setNewRecord({ ...newRecord, diagnostico: e.target.value })}
                        placeholder="Describe el diagnóstico..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tratamiento">Tratamiento</Label>
                      <Textarea
                        id="tratamiento"
                        value={newRecord.tratamiento}
                        onChange={(e) => setNewRecord({ ...newRecord, tratamiento: e.target.value })}
                        placeholder="Describe el tratamiento aplicado..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicamentos">Medicamentos</Label>
                      <Textarea
                        id="medicamentos"
                        value={newRecord.medicamentos}
                        onChange={(e) => setNewRecord({ ...newRecord, medicamentos: e.target.value })}
                        placeholder="Lista los medicamentos recetados..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={newRecord.observaciones}
                        onChange={(e) => setNewRecord({ ...newRecord, observaciones: e.target.value })}
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit">Guardar Registro</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {selectedPet && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Registros Médicos</h3>
                {historialMedico.map((registro) => (
                  <Card key={registro.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{registro.diagnostico}</h4>
                          <p className="text-sm text-gray-600">
                            {registro.fecha} - {registro.veterinario?.nombre || "Veterinario no especificado"}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          {registro.peso_actual && <Badge variant="outline">{registro.peso_actual} kg</Badge>}
                          {registro.temperatura && (
                            <Badge variant="outline" className="ml-2">
                              {registro.temperatura}°C
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Tratamiento:</strong> {registro.tratamiento}
                        </div>
                        <div>
                          <strong>Medicamentos:</strong> {registro.medicamentos}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
