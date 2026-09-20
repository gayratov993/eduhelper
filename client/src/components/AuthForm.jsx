import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, register, clearError } from '../store/authSlice'
import { Logo } from './brand'
import { Alert } from './icons'

export default function AuthForm() {
  const dispatch = useDispatch()
  const { error, submitting } = useSelector((s) => s.auth)
  const [mode, setMode] = useState('login')
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)

  function switchMode(next) {
    setMode(next)
    dispatch(clearError())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const body = {
      username: usernameRef.current.value.trim(),
      password: passwordRef.current.value,
    }
    if (mode === 'login') {
      await dispatch(login(body))
    } else {
      await dispatch(register(body))
    }
  }

  return (
    <div className="grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_35%_at_50%_0%,rgba(99,102,241,0.28),transparent),radial-gradient(35%_25%_at_90%_100%,rgba(168,85,247,0.18),transparent)] dark:bg-[radial-gradient(50%_35%_at_50%_0%,rgba(99,102,241,0.25),transparent),radial-gradient(35%_25%_at_90%_100%,rgba(139,92,246,0.15),transparent)]" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-line bg-card p-8 shadow-2xl shadow-black/10">
          <div className="mb-5 flex items-center gap-3">
            <Logo size={48} />
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">EduHelper</h1>
              <p className="text-xs font-semibold text-muted">O'quv vazifalarini boshqarish</p>
            </div>
          </div>
          <p className="mb-6 text-sm text-muted">
            {mode === 'login'
              ? 'Profilga kirib, vazifalaringizni ko\'ring'
              : 'Hisob yarating — 30 soniyada boshlang'}
          </p>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-app p-1">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition ${
                  mode === m ? 'bg-accent text-white shadow' : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 whitespace-pre-line rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-200"
            >
              <Alert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              ref={usernameRef}
              name="username"
              placeholder={mode === 'register' ? 'Foydalanuvchi nomi (3-20 belgi)' : 'Foydalanuvchi nomi'}
              autoComplete="username"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
            />
            <input
              type="password"
              ref={passwordRef}
              name="password"
              placeholder={mode === 'register' ? 'Parol (kamida 6 belgi)' : 'Parol'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/25"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 cursor-pointer rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Yuborilmoqda…' : mode === 'login' ? 'Kirish →' : 'Hisob yaratish →'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-faint">
          Har bir foydalanuvchi faqat o'z vazifalarini ko'radi · JWT autentifikatsiya
        </p>
      </div>
    </div>
  )
}