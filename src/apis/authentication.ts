import { POST } from "../utils/request"

export const login = (payload: { email: string, password: string }) => POST('/login', payload)

export const logout = () => POST('/logout')