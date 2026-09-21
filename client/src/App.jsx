import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { initialize, logout } from './store/authSlice'
import { getToken } from './api/auth'
import AppShell from './components/AppShell'
import AuthForm from './components/AuthForm'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import CalendarPage from './pages/CalendarPage'
import Focus from './pages/Focus'
import Profile from './pages/Profile'
import { useLang } from './i18n'

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-app">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        <p className="text-sm text-muted">Yuklanmoqda…</p>
      </div>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()
  const { user, initializing } = useSelector((s) => s.auth)
  const { lang } = useLang()

  useEffect(() => {
    dispatch(initialize())
  }, [dispatch])

  useEffect(() => {
    if (user && !getToken()) dispatch(logout())
  }, [user, dispatch])

  if (initializing) return <Splash />
  if (!user) return <AuthForm />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="stats" element={<Stats />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="focus" element={<Focus />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}