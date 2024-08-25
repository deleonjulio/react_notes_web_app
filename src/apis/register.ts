import { POST } from "../utils/request"

export const register = (payload: { email: string, name: string, password: string }) => POST('/register', payload);