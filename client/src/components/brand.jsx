const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6366f1'/><stop offset='1' stop-color='#d946ef'/></linearGradient></defs><rect width='64' height='64' rx='15' fill='url(#g)'/><path d='M32 14 52 25 32 36 12 25 32 14Z' fill='white'/><path d='M20 30v11c0 4 5.5 8 12 8s12-4 12-8V30' stroke='white' stroke-width='4.5' fill='none' stroke-linecap='round'/><path d='M13 28v10' stroke='white' stroke-width='4.5' stroke-linecap='round' opacity='.75'/></svg>`,
  )

export function Logo({ size = 36, className = '' }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl shadow-lg shadow-indigo-500/30 ${className}`}
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#6366f1,#a855f7,#d946ef)' }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 64 64" fill="none" aria-hidden>
        <path d="M32 10 54 22 32 34 10 22 32 10Z" fill="#fff" />
        <path
          d="M20 28v10c0 4.2 5.4 8.2 12 8.2s12-4 12-8.2V28"
          stroke="#fff"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M13 26v9" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
      </svg>
    </span>
  )
}

export function Avatar({ name, size = 40, rounded = 'rounded-2xl' }) {
  const hash = [...String(name || '?')].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const h1 = hash % 360
  const h2 = (h1 + 45) % 360
  const letter = String(name || '?').charAt(0).toUpperCase()

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${rounded} shadow-lg`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${h1} 78% 56%), hsl(${h2} 72% 46%))`,
      }}
    >
      <span
        className="font-display font-extrabold tracking-tight text-white"
        style={{ fontSize: size * 0.44 }}
      >
        {letter}
      </span>
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_70%_at_20%_0%,rgba(255,255,255,0.35),transparent)]"
      />
      <svg
        className="absolute right-[12%] top-[10%] text-white/80"
        width={size * 0.22}
        height={size * 0.22}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" />
      </svg>
    </span>
  )
}

export { FAVICON }