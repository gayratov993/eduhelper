export default function Progress({ done, total }) {
  const percent = total ? Math.round((done / total) * 100) : 0
  const angle = total ? Math.round((done / total) * 360) : 0

  return (
    <div className="relative rounded-2xl border border-line bg-card p-5 shadow-lg shadow-black/5">
      <div className="flex items-center gap-5">
        <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--accent) ${angle}deg, color-mix(in oklab, var(--ink) 10%, transparent) 0deg)`,
          }}
        >
          <div className="grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-card font-display text-xl font-bold text-ink">
            {percent}%
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-base font-bold text-ink">Taraqqiyot</h2>
            <span className="text-sm font-semibold text-accent">
              {done} / {total} bajarildi
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {total === 0
              ? 'Birinchi vazifangizni qo\'shing va seriyani boshlang'
              : percent === 100
                ? 'Mukammal! Barchasini bajardingiz — seriyangiz saqlandi'
                : `Yana ${total - done} ta vazifa qoldi. Mashq uzluksizligini buzmaymiz!`}
          </p>
        </div>
      </div>
    </div>
  )
}