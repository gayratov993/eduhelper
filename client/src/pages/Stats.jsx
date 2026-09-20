import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { isOverdue, isSameDay, startOfDay, perFan, donePerDay, weekDoneCount, dominantFan, fmtDayShort } from '../utils/date'
import { FANLAR, FAN_STYLE } from '../constants'
import { Collection, Check, Leaf, Alert, Chart, Target, Trophy, Sparkles, Timer } from '../components/icons'

export default function Stats() {
  const items = useSelector((s) => s.tasks.items)

  const stats = useMemo(() => {
    const total = items.length
    const done = items.filter((t) => t.isDone).length
    const pending = total - done
    const overdue = items.filter(isOverdue).length
    const percent = total ? Math.round((done / total) * 100) : 0
    const week = donePerDay(items, 7)
    const maxDay = Math.max(1, ...week.map((d) => d.count))
    const fans = perFan(items)
    const weekDone = weekDoneCount(items)
    const best = dominantFan(items)
    return { total, done, pending, overdue, percent, week, maxDay, fans, weekDone, best }
  }, [items])

  const { total, done, pending, overdue, percent, week, maxDay, fans, weekDone, best } = stats
  const today = startOfDay(new Date())

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Chart size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Statistika</h1>
          <p className="mt-0.5 text-sm text-muted">O'qish dinamikasi — haftalik bajarish va fanlar bo'yicha sur'at.</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { Icon: Collection, label: 'Jami vazifa', value: total },
          { Icon: Check, label: 'Bajarilgan', value: done },
          { Icon: Leaf, label: 'Davom etmoqda', value: pending },
          { Icon: Alert, label: 'Muddati o\'tgan', value: overdue },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="rounded-2xl border border-line bg-card p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface text-muted">
              <Icon size={18} />
            </span>
            <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
            <p className="text-xs font-semibold text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-3">
        {/* Haftalik grafik */}
        <div className="rounded-2xl border border-line bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Oxirgi 7 kun</h2>
              <p className="mt-0.5 text-xs text-muted">Har bir kunda bajarilgan vazifalar</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
              <Target size={12} />
              Haftada {weekDone} ta
            </span>
          </div>

          <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
            {week.map((d) => {
              const isToday = isSameDay(d.day, today)
              const isMax = d.count > 0 && d.count === maxDay
              return (
                <div key={d.day.getTime()} className="group flex flex-1 flex-col items-center gap-2">
                  <span className={`text-xs font-bold ${d.count ? 'text-ink' : 'text-faint'}`}>{d.count > 0 ? d.count : ''}</span>
                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      isToday
                        ? 'bg-accent'
                        : isMax
                          ? 'bg-accent/70'
                          : 'bg-accent/25 group-hover:bg-accent/40'
                    }`}
                    style={{ height: `${(d.count / maxDay) * 100 + 6}%` }}
                  />
                  <span className={`text-[11px] font-semibold capitalize ${isToday ? 'text-accent' : 'text-faint'}`}>
                    {fmtDayShort(d.day)}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-faint">Bugungi kun ko'k rang bilan belgilangan</p>
        </div>

        {/* Fan progress */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-base font-bold text-ink">Umumiy holat</h2>

          <div className="rounded-xl border border-line bg-surface p-4 text-center">
            <p className="font-display text-4xl font-extrabold text-accent">{percent}%</p>
            <p className="mt-1 text-xs font-semibold text-muted">bajarish darajasi</p>
          </div>

          {best.fan && best.count > 0 && (
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
              <Trophy size={15} className="mt-0.5 shrink-0 text-amber-500" />
              <span>
                Eng faol faningiz:{' '}
                <span className="font-bold text-ink">{FAN_STYLE[best.fan].select}</span> — {best.count} ta vazifa
              </span>
            </div>
          )}

          <div className="mt-1 flex flex-col gap-4">
            {FANLAR.map((fan) => {
              const s = fans.get(fan)
              const totalFan = s?.total || 0
              const doneFan = s?.done || 0
              const pct = totalFan ? Math.round((doneFan / totalFan) * 100) : 0
              return (
                <div key={fan} className={totalFan === 0 ? 'opacity-40' : ''}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-muted">{FAN_STYLE[fan].select}</span>
                    <span className="font-semibold text-faint">{doneFan}/{totalFan} · {pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${FAN_STYLE[fan].bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
          <Sparkles size={16} className="text-accent" />
          Maslahat
        </h2>
        <p className="mt-2 text-sm text-muted">
          {total === 0
            ? 'Boshlash uchun Bosh sahifaga o\'tib birinchi vazifangizni qo\'shing.'
            : percent === 100
              ? 'Barchasi bajarildi! Yangi bosqich uchun reja tuzing.'
              : overdue > 0
                ? `${overdue} ta vazifangiz muddatidan o'tgan — bugun ulardan 1-2 tasini tugating va seriya tez tiklanadi.`
                : `Yaxshi sur'atdasiz. Fokus sahifasida 25 daqiqalik sessiya boshlang — ${pending} ta qolgan vazifa kutmoqda.`}
        </p>
        <Link to="/focus" className="mt-3 inline-block text-xs font-bold text-accent hover:underline">
          Fokus sahifasiga o'tish →
        </Link>
      </section>
    </div>
  )
}