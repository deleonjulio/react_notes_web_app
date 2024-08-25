import axios from 'axios'
export const POST = async (url: string, data?: unknown) => await axios(`${import.meta.env.VITE_API_URL}${url}`, {
  method: 'POST',
  data,
  withCredentials: true
})

export const PUT = async (url: string, data?: unknown) => await axios(`${import.meta.env.VITE_API_URL}${url}`, {
  method: 'PUT',
  data,
  withCredentials: true
})

export const GET = async (url: string) => await axios(`${import.meta.env.VITE_API_URL}${url}`, {
  method: 'GET',
  withCredentials: true
})

export const DELETE = async (url: string) => await axios(`${import.meta.env.VITE_API_URL}${url}`, {
  method: 'DELETE',
  withCredentials: true
})