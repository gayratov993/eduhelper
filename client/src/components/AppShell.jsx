import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { useTheme } from '../theme'
import { todayLabel } from '../utils/date'
import { Logo, Avatar } from './brand'
import { Home, Chart, Calendar, Timer, User, Sun, Moon, LogOut, Menu, X } from './icons'

const NAV = [
  { to: '/', label: 'Bosh sahifa', Icon: Home, end: true },
  { to: '/stats', label: 'Statistika', Icon: Chart },
  { to: '/calendar', label: 'Kalendar', Icon: Calendar },
  { to: '/focus', label: 'Fokus', Icon: Timer },
  { to: '/profile', label: 'Profil', Icon: User },
]

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={40} />
      <div className="leading-tight">
        <p className="font-display text-sm font-bold text-ink">EduHelper</p>
        <p className="text-[11px] text-faint">O'quv vazifalarini boshqarish</p>
      </div>
    </div>
  )
}

function ThemeButton() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-muted transition hover:text-ink"
      title="Kunduz/tun rejimini almashtirish"
    >
      <span className="flex items-center gap-2">
        {dark ? <Moon size={16} /> : <Sun size={16} />}
        {dark ? 'Tun rejimi' : 'Kunduz rejimi'}
      </span>
      <span className={`relative h-5 w-9 rounded-full transition ${dark ? 'bg-accent' : 'bg-faint'} `}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${dark ? 'left-4.5' : 'left-0.5'}`}
        />
      </span>
    </button>
  )
}

function NavList({ onNavigate }) {
  const cls = ({ isActive }) =>
    `flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
      isActive ? 'bg-accent-soft text-ink shadow-sm' : 'text-muted hover:bg-surface hover:text-ink'
    }`

  return (
    <nav className="flex flex-col gap-1.5">
      {NAV.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={cls} onClick={onNavigate}>
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function UserBlock() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  if (!user) return null
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar name={user.username} size={36} rounded="rounded-xl" />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-bold text-ink">{user.username}</p>
          <p className="text-[11px] text-faint">Talaba · EDU</p>
        </div>
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-faint transition hover:bg-rose-500/15 hover:text-rose-400"
        title="Chiqish"
      >
        <LogOut size={15} />
      </button>
    </div>
  )
}

export default function AppShell() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-app">
      {/* ─── Desktop sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 border-r border-line bg-card px-4 py-6 lg:flex">
        <div className="px-1">
          <Brand />
        </div>
        <NavList />
        <div className="mt-auto flex flex-col gap-3">
          <p className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[11px] font-semibold capitalize text-muted">
            <Calendar size={12} className="text-accent" />
            {todayLabel()}
          </p>
          <ThemeButton />
          <UserBlock />
        </div>
      </aside>

      {/* ─── Mobile top bar ─── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-card/85 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-ink"
          aria-label="Menyuni ochish"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ─── Mobile drawer ─── */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-card px-4 py-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-faint hover:text-ink"
                aria-label="Menyuni yopish"
              >
                <X size={18} />
              </button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
            <div className="mt-auto flex flex-col gap-3">
              <ThemeButton />
              <UserBlock />
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  )
}