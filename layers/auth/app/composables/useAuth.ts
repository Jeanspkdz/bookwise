import { authClient } from '~~/layers/auth/app/utils/auth'
import type { Result } from '~~/layers/shared/shared/types/result'

export function useAuth() {
  const register = async (
    payload: RegisterFormPayload,
  ): Promise<Result<RegisterResponse, string>> => {
    try {
      const { error, data } = await authClient.signUp.email({
        name: payload.fullName,
        email: payload.email,
        password: payload.password,
        studentCode: payload.studentCode,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
      })

      console.log('REGISTRE', {
        error,
        data,
      })

      if (error) {
        return {
          type: 'failure',
          error: error.message || 'Something went wrong. Failed to register',
        }
      }

      return {
        type: 'success',
        data: {
          email: payload.email,
          requiresAdminApproval: true,
        },
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to register',
      }
    }
  }

  const login = async (payload: LoginFormPayload): Promise<Result<LoginResponse, string>> => {
    try {
      const { error, data } = await authClient.signIn.email({
        email: payload.email,
        password: payload.password,
      })

      console.log('LOGIN', {
        error,
        data,
      })

      if (error) {
        return {
          type: 'failure',
          error: error.message || 'Something went wrong. Failed to login',
        }
      }

      return {
        type: 'success',
        data: {
          email: data.user.email,
          name: data.user.name,
        },
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to login',
      }
    }
  }

  const logout = async (): Promise<Result<LogoutResponse, string>> => {
    try {
      const { error } = await authClient.signOut()

      if (error) {
        return {
          type: 'failure',
          error: error.message || 'Something went wrong. Failed to logout',
        }
      }

      return {
        type: 'success',
        data: {
          success: true,
        },
      }
    } catch {
      return {
        type: 'failure',
        error: 'Something went wrong. Failed to logout',
      }
    }
  }

  return {
    register,
    login,
    logout,
  }
}
