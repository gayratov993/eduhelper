const base = (props = {}) => ({
  width: props.size || 18,
  height: props.size || 18,
  viewBox: '0 0 24 24',
  fill: props.fill || 'none',
  stroke: props.fill ? 'none' : 'currentColor',
  strokeWidth: props.strokeWidth || 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const Home = (p) => (
  <svg {...base(p)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></svg>
)

export const Chart = (p) => (
  <svg {...base(p)}><path d="M3 3v18h18" /><path d="M7 15v4" /><path d="M12 9v10" /><path d="M17 5v14" /></svg>
)

export const Calendar = (p) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></svg>
)

export const Timer = (p) => (
  <svg {...base(p)}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5" /><path d="M9 2h6" /></svg>
)

export const User = (p) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></svg>
)

export const Sun = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)

export const Moon = (p) => (
  <svg {...base(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
)

export const LogOut = (p) => (
  <svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
)

export const Plus = (p) => (
  <svg {...base(p)}><path d="M12 5v14" /><path d="M5 12h14" /></svg>
)

export const Search = (p) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
)

export const Refresh = (p) => (
  <svg {...base(p)}><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></svg>
)

export const Trash = (p) => (
  <svg {...base(p)}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
)

export const Pencil = (p) => (
  <svg {...base(p)}><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
)

export const Check = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" /></svg>
)

export const Clock = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)

export const Bell = (p) => (
  <svg {...base(p)}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
)

export const Alert = (p) => (
  <svg {...base(p)}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
)

export const Bolt = (p) => (
  <svg {...base(p)}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
)

export const Collection = (p) => (
  <svg {...base(p)}><rect x="8" y="3" width="8" height="14" rx="2" /><path d="M5 7v13a2 2 0 0 0 2 2h11" /></svg>
)

export const Target = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
)

export const Coffee = (p) => (
  <svg {...base(p)}><path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><path d="M6 2v3M10 2v3M14 2v3" /></svg>
)

export const Leaf = (p) => (
  <svg {...base(p)}><path d="M20 4c-8 0-14 4-14 12a9 9 0 0 0 9 9c8 0 9-13 5-21Z" /><path d="M6 20C10 16 14 12 18 8" /></svg>
)

export const Trophy = (p) => (
  <svg {...base(p)}><path d="M7 4h10v6a5 5 0 0 1-10 0Z" /><path d="M7 6H4a2 2 0 0 0 2 5h1" /><path d="M17 6h3a2 2 0 0 1-2 5h-1" /><path d="M12 15v4" /><path d="M9 21h6" /></svg>
)

export const Sparkles = (p) => (
  <svg {...base(p)}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" /><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9Z" /></svg>
)

export const Menu = (p) => (
  <svg {...base(p)}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
)

export const X = (p) => (
  <svg {...base(p)}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)

export const ChevronLeft = (p) => (
  <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>
)

export const ChevronRight = (p) => (
  <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>
)

export const Play = (p) => (
  <svg {...base(p)}><path d="M7 4.5v15l13-7.5Z" /></svg>
)

export const Pause = (p) => (
  <svg {...base(p)}><path d="M9 4v16" /><path d="M15 4v16" /></svg>
)