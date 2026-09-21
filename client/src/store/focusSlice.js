import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/focus'

export const fetchFocusSummary = createAsyncThunk('focus/fetchSummary', api.getFocusSummary)

export const recordFocus = createAsyncThunk('focus/record', api.recordFocus)

const initialState = {
  summary: null,
  loading: false,
}

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFocusSummary.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFocusSummary.fulfilled, (state, action) => {
        state.loading = false
        state.summary = action.payload
      })
      .addCase(fetchFocusSummary.rejected, (state) => {
        state.loading = false
      })
  },
})

export default focusSlice.reducer