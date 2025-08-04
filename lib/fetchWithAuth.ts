export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    return response;
  }
  