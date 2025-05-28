const API_BASE_URL = "http://localhost:3001/api"

// Función para obtener el token del localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Función helper para hacer requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error en la petición")
  }

  return response.json()
}

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  register: async (userData: any) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  },
}

// Servicios de mascotas
export const petService = {
  getAll: () => apiRequest("/mascotas"),
  create: (petData: any) =>
    apiRequest("/mascotas", {
      method: "POST",
      body: JSON.stringify(petData),
    }),
}

// Servicios de citas
export const appointmentService = {
  getAll: () => apiRequest("/citas"),
  create: (appointmentData: any) =>
    apiRequest("/citas", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }),
}

// Servicios de historial médico
export const medicalService = {
  getHistory: (petId: string) => apiRequest(`/historial/${petId}`),
  createRecord: (recordData: any) =>
    apiRequest("/historial", {
      method: "POST",
      body: JSON.stringify(recordData),
    }),
}

// Servicios de veterinarios
export const veterinarianService = {
  getAll: () => apiRequest("/veterinarios"),
}
