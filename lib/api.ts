import axios from "axios"

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // use env var here
})

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default API
