# LPK Bina Karya Nusantara

Website lembaga pelatihan kerja (LPK) untuk program kerja luar negeri (manufaktur, perawat, perhotelan, dll). Dibangun dengan **Next.js 16**, **Drizzle ORM**, **Neon PostgreSQL**, dan **shadcn/ui (Base UI, nova)**.

## Fitur

- **Landing page** — beranda, negara tujuan, program, berita, testimoni, FAQ, galeri, kontak
- **Autentikasi & RBAC** — NextAuth (Credentials, JWT), 5 role (super_admin, admin, staff, instructor, student), 47+ permission
- **Dashboard admin** — statistik & grafik, manajemen pendaftar (alur status + timeline), CRUD konten (negara, program, perusahaan, berita, banner, testimoni, FAQ), manajemen pengguna & role, pesan kontak, log aktivitas, laporan, pengaturan
- **Pendaftaran pekerja migran** — form multi-langkah (data pribadi, pendidikan, alamat), upload dokumen, pelacakan status
- **Mode gelap/terang**

## Teknologi

- Next.js 16 (App Router, Turbopack, `output: "standalone"`)
- Drizzle ORM + PostgreSQL (Neon)
- shadcn/ui (Base UI nova) + Tailwind CSS v4
- NextAuth v5, TanStack Query/Table, react-hook-form, Zod v4, Zustand, recharts, sonner

## Memulai

```bash
npm install

# 1. Atur environment
cp .env.example .env   # isi DATABASE_URL (PostgreSQL/Neon)
# .env.local: AUTH_SECRET, AUTH_TRUST_HOST

# 2. Buat skema + seed
npm run db:push
npm run db:seed        # role, permission, admin user
npm run db:seed:content

# 3. Jalankan
npm run dev            # pengembangan (http://localhost:3000)
```

### Produksi (standalone)

```bash
npm run build          # menghasilkan .next/standalone + menyalin static/public
npm start              # node start.js (memuat .env/.env.local)
```

## Akun default

- **Admin:** `admin@lpk.com` / `admin123` (segera ganti di produksi)

## Scripts

| Script | Fungsi |
|--------|--------|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi (standalone) |
| `npm start` | Menjalankan server standalone |
| `npm run lint` | ESLint |
| `npm run db:push` | Sinkronkan skema Drizzle ke DB |
| `npm run db:seed` | Seed role/permission/user admin |
| `npm run db:seed:content` | Seed konten demo |

## Docker

```bash
docker compose up --build   # web di :3000 (butuh DATABASE_URL & AUTH_SECRET di env)
```
