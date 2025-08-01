import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8000", // or process.env.NEXT_PUBLIC_API_BASE_URL
})

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default API

//localStorage.setItem("token", "blabla") on inspect web, get token from login postman

