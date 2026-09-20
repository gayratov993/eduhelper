# 📚 EduHelper — O'quv Planeri

Uy vazifalari va muddatlarni boshqarish uchun to'liq **full-stack** veb-ilova.

Har bir foydalanuvchi ro'yxatdan o'tadi va **faqat o'z vazifalarini** ko'radi. Ilova task qo'shish, bajarilganini belgilash, qidirish, saralash, fanlar bo'yicha statistikaga olish, kalendar va Pomodoro fokus rejimini o'z ichiga oladi.

> **Texnologiyalar:** React 19 · Redux Toolkit · TailwindCSS 4 · Vite 6 (frontend) + Node.js · Express 5 · Mongoose 8 · MongoDB Atlas (backend).

---

## 📸 Ko'rinish

- 🎨 Premium dark/light dizayn (CSS-variables asosida, bir tugmada almashadi)
- 📱 To'liq responsiv — desktop (sidebar) va mobil (drawer) rejimlari
- 📊 Vizual statistika: progress ring, haftalik bar-chart, fan progress barlari

## ✨ Imkoniyatlar

### 🔐 Autentifikatsiya (JWT + bcrypt)
- Ro'yxatdan o'tish va kirish (`/api/auth/register`, `/api/auth/login`)
- Parol **bcrypt** bilan xeshlanadi (10 round) — bazada ochiq parol saqlanmaydi
- 7 kun davom etadigan JWT token (localStorage)
- Har bir so'rovda token tekshiriladi (`Bearer` header)

### 👤 Izolyatsiya
- Har foydalanuvchi **faqat o'z vazifalarini** ko'radi
- Boshqa foydalanuvchining vazifasiga urinish → **404** (mavjud emas deb yashiriladi)

### ✅ Vazifalar (CRUD)
- Qo'shish: **nom** (required, max 120 belgi), **fan** (enum: Dasturlash/Matematika/Ingliz tili/Fizika/Boshqa), **muddat** (date)
- Bajarilganini belgilash (`PATCH isDone`) → `doneAt` avtomatik yoziladi
- Inline tahrirlash (nom/fan/muddat) va o'chirish
- Qidiruv + saralash (eng yangi/eng yaqin muddat/nom/fan)

### 📊 Statistika
- **Bosh sahifa:** jami, bajarilgan, bugungi, muddati o'tgan kartalar + progress ring
- **Statistika:** 7 kunlik bar-chart (`doneAt` asosida), fan progress, eng faol fan
- **Kalendar:** oy grid, har kunga tushgan muddatlar, tanlangan kun ro'yxati
- **Fokus:** Pomodoro 25/5/15, kunlik sessiya va daqiqa hisobi, fan belgisi
- **Profil:** hisob kartasi, statistik ko'rsatkichlar, tema rejimi, chiqish

### ⚠️ Xatolik UX (maxsus o'ylangan)
- Bo'sh nom yuborilsa → foydalanuvchi **serverning 400 xabarini** ko'radi (`problems` ro'yxati)
- Server o'chiq bo'lsa → **oq ekran emas**, "Serverga ulana olmadik" banneri + "Qayta urinish" tugmasi

---

## 🧱 Struktura

```
.
├── index.js                  # Express serveri: API + auth + build'ga xizmat (SPA)
├── middleware/auth.js        # JWT imzo (signToken) va tekshirish (authRequired)
├── models/Task.js            # Task Schema: title(required), fan(enum), dueDate, isDone, doneAt, user
├── models/User.js            # User Schema: username(unique), password(bcrypt, select:false)
├── client/                   # React + Redux Toolkit + TailwindCSS 4 + Vite
│   ├── src/
│   │   ├── api/              # fetch qatlami (token avtomatik qo'shiladi, NETWORK aniqlash)
│   │   ├── store/            # Redux slice'lar: authSlice, tasksSlice (createAsyncThunk)
│   │   ├── components/       # AppShell, AuthForm, TaskList, Filters, FanStats, Progress...
│   │   ├── pages/            # Dashboard, Stats, CalendarPage, Focus, Profile
│   │   ├── theme.jsx         # dark/light tema konteksti
│   │   └── utils/date.js     # sana yordamchilari (dueMeta, donePerDay, ...)
│   ├── index.html
│   └── vite.config.js        # dev-server: proxy /api → localhost:3000
├── requests.http             # REST Client sinovlari (VS Code)
├── .env.example              # Muhit o'zgaruvchilari namunasi (maxfiy emas)
└── README.md
```

---

## 🚀 Ishga tushurish

Talab: **Node.js ≥ 18** va **npm**.

### 1. Reponi o'lash va kutubxonalarni o'rnatish

```bash
git clone <REPO_URL>
cd <loyiha-papka>

npm install         # backend
cd client && npm install   # frontend
cd ..
```

### 2. Muhit faylini sozlash (`.env`)

`.env.example`'ni nusxalab `.env` yarating va to'ldiring:

```bash
cp .env.example .env   # (Windows: copy .env.example .env)
```

```env
MONGODB_URI=mongodb+srv://LOGIN:PAROL@cluster0.xxxxx.mongodb.net/tasks?appName=Cluster0
JWT_SECRET=ixtiyoriy_uzun_maxfiy_qator
PORT=3000
```

> **Muhim:** `.env` maxfiy fayl va git'ga kiritilmaydi (.gitignore'da). MongoDB Atlas panelida `Network Access → Add IP address → 0.0.0.0/0` (yoki o'z IP'ingiz) ruxsatini bergan bo'ling.

### 3. Frontend'ni build qilish

```bash
npm run build
```

### 4. Serverni ishga tushirish

```bash
npm start
```

Brauzerda oching: **http://localhost:3000**

### Ishlab chiqish rejimi (alohida terminal)

```bash
npm run dev            # backend — http://localhost:3000
npm run dev:client     # frontend (Vite) — http://localhost:5173 (API proxylangan)
```

---

## 📡 API

Bazaviy URL: `http://localhost:3000`. Token kerak bo'lgan yo'llarda `Authorization: Bearer <token>` header yuboriladi.

### Auth

| Method | Yo'l                 | Tavsif                          | Javob |
|--------|----------------------|---------------------------------|-------|
| POST   | `/api/auth/register` | Ro'yxatdan o'tish               | `201 { token, user }` |
| POST   | `/api/auth/login`    | Kirish                          | `200 { token, user }` |
| GET    | `/api/auth/me`       | Joriy foydalanuvchi (token)     | `200 { id, username }` |

### Tasks (barchasi auth talab)

| Method | Yo'l             | Tavsif                                        |
|--------|------------------|-----------------------------------------------|
| GET    | `/api/tasks`     | O'z vazifalari (yangidan eskisiga qarab)      |
| POST   | `/api/tasks`     | Yangi vazifa. `{ title, fan, dueDate }`       |
| PATCH  | `/api/tasks/:id` | Yangilash. Faqat `title, fan, dueDate, isDone` |
| DELETE | `/api/tasks/:id` | O'chirish                                     |

### Misol: vazifa qo'shish

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Express routing amaliyoti","fan":"Dasturlash","dueDate":"2026-09-22"}'
```

### Misol: registratsiya

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"azizjon","password":"secret123"}'
```

---

## 🛡️ Xatolik tuzilishi

Barcha javoblar doimiy formatda:

```json
// Validatsiya xatosi (400)
{ "error": "Ma'lumotlar noto'g'ri kiritildi", "problems": ["Vazifa nomi bo'sh bo'lishi mumkin emas"] }
```

| Holat | Sabab |
|-------|-------|
| `400` | Noto'g'ri ma'lumot (required/enum/match/maxlength) yoki noto'g'ri `_id` (CastError) |
| `401` | Token yo'q yoki amal qilmaydi (muddat tugagan) |
| `404` | Vazifa topilmadi yoki **boshqa foydalanuvchiniki** |
| `409` | Username allaqachon band |
| `500` | Kutilmagan server xatosi |

---

## 🔒 Xavfsizlik

- Parollar ochiq saqlanmaydi — bcrypt hash (10 round)
- `password` maydoni API javoblarida chiqmaydi (`select: false`)
- Token JWT, 7 kun amal qiladi
- `PATCH` `user`, `doneAt`, `createdAt` kabi himoyalangan maydonlarni qabul qilmaydi (whitelist)
- Har user faqat o'z ma'lumotlari bilan ishlaydi (izolyatsiya)
- `.env` (MongoDB parollari, JWT_SECRET) git'ga kiritilmaydi

---

## 🧪 Sinovlar

VS Code'da **REST Client** kengaytmasi bilan `requests.http` faylini oching va har bir so'rovni bajaring (`"Send Request"` tugmasi). Token'nikini olish uchun avval login so'roviga token oling.

---

## 📜 Litsenziya

Bu loyiha o'quv maqsadida yaratilgan. Erkin foydalaning — ta'lim uchun yaratilgan.