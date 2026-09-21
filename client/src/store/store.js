import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice'
import authReducer from './authSlice'
import goalsReducer from './goalSlice'
import focusReducer from './focusSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    goals: goalsReducer,
    focus: focusReducer,
  },
})