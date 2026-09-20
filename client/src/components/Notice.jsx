import { useDispatch } from 'react-redux'
import { clearNotice, fetchTasks } from '../store/tasksSlice'
import { Refresh, Alert, X } from './icons'

export default function Notice({ notice, offline }) {
  const dispatch = useDispatch()
  if (!notice) return null

  const isNetwork = offline || /Serverga ulana olmadik/.test(notice)

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-lg ${
        isNetwork
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200'
          : 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200'
      }`}
    >
      <span className="mt-0.5 shrink-0">{isNetwork ? <Refresh size={16} /> : <Alert size={16} />}</span>
      <p className="flex-1 whitespace-pre-line">{notice}</p>
      {isNetwork && (
        <button
          onClick={() => dispatch(fetchTasks())}
          className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-500/30 dark:text-amber-100"
        >
          Qayta urinish
        </button>
      )}
      <button
        onClick={() => dispatch(clearNotice())}
        className="rounded-lg px-2 py-1.5 text-xs text-faint transition hover:bg-app hover:text-ink"
        aria-label="Yopish"
      >
        <X size={14} />
      </button>
    </div>
  )
}