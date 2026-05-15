export type RegisterFormPayload = {
  fullName: string
  studentCode: string
  phoneNumber: string
  address: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterEventHandler = (payload: RegisterFormPayload) => Promise<void>

export type RegisterResponse = {
  email: string
  requiresAdminApproval: boolean
}

export type LoginFormPayload = {
  email: string
  password: string
}

export type LoginEventHandler = (payload: LoginFormPayload) => Promise<void>

export type LoginResponse = {
  email: string
  name: string
}
