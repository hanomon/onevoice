import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chat API
export const chatAPI = {
  sendMessage: async (question: string) => {
    const response = await apiClient.post('/api/chat/', { question })
    return response.data
  },
}

// VOC API
export const vocAPI = {
  create: async (data: { user_name: string; category: string; content: string }) => {
    const response = await apiClient.post('/api/voc/', data)
    return response.data
  },
  getAll: async () => {
    const response = await apiClient.get('/api/voc/')
    return response.data
  },
}

// Upload API
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  getFiles: async () => {
    const response = await apiClient.get('/api/upload/files')
    return response.data
  },
  deleteFile: async (fileId: number) => {
    const response = await apiClient.delete(`/api/upload/${fileId}`)
    return response.data
  },
}

