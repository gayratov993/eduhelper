import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { useTheme } from '../theme'
import { isOverdue, weekDoneCount } from '../utils/date'
import { t } from '../i18n'
import { Avatar } from '../components/brand'
import LangSwitch from '../components/LangSwitch'
import { User, Moon, Sun, Collection, Check, Bolt, Alert } from '../components/icons'

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const items = useSelector((s) => s.tasks.items)
  const { dark, toggle } = useTheme()

  const done = items.filter((t) => t.isDone).length
  const total = items.length
  const percent = total ? Math.round((done / total) * 100) : 0
  const overdue = items.filter(isOverdue).length
  const weekDone = weekDoneCount(items)

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
          <User size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">{t('profile.header')}</h1>
          <p className="mt-0.5 text-sm text-muted">{t('profile.headerText')}</p>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="h-20 bg-gradient-to-r from-indigo-500/40 via-violet-500/25 to-fuchsia-500/40" />
        <div className="px-6 pb-6">
          <div className="-mt-9 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar name={user?.username} size={76} rounded="rounded-2xl" />
              <div className="pb-1">
                <p className="font-display text-xl font-extrabold text-ink">@{user?.username}</p>
                <p className="text-xs text-muted">{t('profile.savedAnywhere')}</p>
              </div>
            </div>
            <Link to="/" className="rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110">
              {t('profile.home')}
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { key: 'profile.statTasks', value: total, Icon: Collection },
              { key: 'profile.statDone', value: done, Icon: Check },
              { key: 'profile.statWeek', value: weekDone, Icon: Bolt },
              { key: 'profile.statOverdue', value: overdue, Icon: Alert },
            ].map(({ key, value, Icon }) => (
              <div key={key} className="rounded-xl border border-line bg-surface p-3.5 text-center">
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-app text-muted">
                  <Icon size={15} />
                </span>
                <p className="mt-1.5 font-display text-xl font-extrabold text-ink">{value}</p>
                <p className="text-[11px] font-semibold text-muted">{t(key)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-bold text-muted">{t('profile.overallDone')}</span>
              <span className="font-extrabold text-accent">{percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl border border-line bg-card p-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-ink">
            {dark ? <Moon size={16} /> : <Sun size={16} />}
            {dark ? t('theme.dark') : t('theme.light')}
          </p>
          <p className="mt-0.5 text-xs text-muted">{t('theme.subtle')}</p>
        </div>
        <button
          onClick={toggle}
          className={`relative h-7 w-13 cursor-pointer rounded-full transition ${dark ? 'bg-accent' : 'bg-faint'}`}
          aria-label="Rejimni almashtirish"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${dark ? 'left-7' : 'left-1'}`}
          />
        </button>
      </section>

      <section className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5">
        <p className="text-sm font-bold text-rose-600 dark:text-rose-300">{t('profile.session')}</p>
        <p className="mt-1 text-xs text-muted">{t('profile.sessionText')}</p>
        <button
          onClick={() => dispatch(logout())}
          className="mt-3 cursor-pointer rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-300"
        >
          {t('profile.logout')}
        </button>
      </section>

      <LangSwitch />
    </div>
  )
}