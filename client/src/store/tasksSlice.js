import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/tasks'

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', api.getTasks)

export const addTask = createAsyncThunk('tasks/addTask', async (body) => {
  return await api.addTask(body)
})

export const toggleTask = createAsyncThunk('tasks/toggleTask', async ({ id, isDone }) => {
  return await api.patchTask(id, { isDone })
})

export const editTask = createAsyncThunk('tasks/editTask', async ({ id, body }) => {
  return await api.patchTask(id, body)
})

export const removeTask = createAsyncThunk('tasks/removeTask', async (id) => {
  await api.deleteTask(id)
  return id
})

const NETWORK_MESSAGE = 'Serverga ulana olmadik. Server ishlayotganini tekshiring.'

const initialState = {
  items: [],
  loading: false,
  notice: null,
  offline: false,
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearNotice: (state) => {
      state.notice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.offline = false
        state.notice = null
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.offline = action.error.message === 'NETWORK'
        state.notice = state.offline ? NETWORK_MESSAGE : action.error.message
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.notice = null
      })
      .addCase(addTask.rejected, (state, action) => {
        state.offline = action.error.message === 'NETWORK'
        state.notice = action.error.message === 'NETWORK' ? NETWORK_MESSAGE : action.error.message
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) => (t._id === action.payload._id ? action.payload : t))
      })
      .addCase(toggleTask.rejected, (state, action) => {
        state.notice = action.error.message
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.items = state.items.map((t) => (t._id === action.payload._id ? action.payload : t))
        state.notice = null
      })
      .addCase(editTask.rejected, (state, action) => {
        state.notice = action.error.message
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload)
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.notice = action.error.message
      })
  },
})

export const { clearNotice } = tasksSlice.actions
export default tasksSlice.reducer