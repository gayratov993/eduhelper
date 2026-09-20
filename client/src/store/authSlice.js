import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authApi from '../api/auth'

export const register = createAsyncThunk('auth/register', async (body) => {
  const data = await authApi.register(body)
  authApi.setToken(data.token)
  return data.user
})

export const login = createAsyncThunk('auth/login', async (body) => {
  const data = await authApi.login(body)
  authApi.setToken(data.token)
  return data.user
})

export const initialize = createAsyncThunk('auth/initialize', async () => {
  if (!authApi.getToken()) return null
  try {
    const me = await authApi.getMe()
    return me
  } catch {
    authApi.clearToken()
    return null
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  authApi.clearToken()
})

const initialState = {
  user: null,
  initializing: true,
  submitting: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initialize.pending, (state) => {
        state.initializing = true
      })
      .addCase(initialize.fulfilled, (state, action) => {
        state.initializing = false
        state.user = action.payload
      })
      .addCase(initialize.rejected, (state) => {
        state.initializing = false
        state.user = null
      })
      .addCase(register.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.submitting = false
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.submitting = false
        state.error = action.error.message
      })
      .addCase(login.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.submitting = false
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.submitting = false
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.error = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer