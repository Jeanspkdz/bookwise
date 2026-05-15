import { authClient } from '~~/layers/auth/app/utils/auth'
import type { Result } from '~~/layers/shared/shared/types/result'

export function useAuth() {
  const getAuth = async () => {
    const { data, isPending, error } = await authClient.useSession(useFetch)

    return {
      isPending,
      error,
      session: data.value?.session,
      user: data.value?.user,
    }
  }

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

  return {
    getAuth,
    register,
    login,
  }
}
