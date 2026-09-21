import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/goals'

export const fetchGoals = createAsyncThunk('goals/fetchGoals', api.getGoals)

export const addGoal = createAsyncThunk('goals/addGoal', async (body) => {
  return await api.addGoal(body)
})

export const removeGoal = createAsyncThunk('goals/removeGoal', async (id) => {
  await api.deleteGoal(id)
  return id
})

const initialState = {
  items: [],
  loading: false,
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchGoals.rejected, (state) => {
        state.loading = false
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(removeGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g._id !== action.payload)
      })
  },
})

export default goalsSlice.reducer