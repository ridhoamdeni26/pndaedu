# PandaEducation — Docker Development Stack

Stack pengembangan berbasis Docker untuk **Laravel + Inertia + React (Vite)**.
Dirancang agar setiap anggota tim cukup menjalankan **satu perintah** untuk
mendapatkan environment dev yang identik (PHP 8.3, Node 22, PostgreSQL 16,
Redis 7).

```
pandaeducation/
├── Dockerfile                  ← image dev (PHP + Node + ekstensi)
├── docker-compose.yml          ← app + postgres + redis
├── .env                        ← variabel untuk compose (port, kredensial)
├── .env.example                ← template di atas
├── .dockerignore
├── docker/
│   └── entrypoint.sh           ← preflight checks + boot dev (animasi)
└── src/                        ← project Laravel
    ├── .env                    ← Laravel env (dibuat otomatis dari .env.example bila kosong)
    └── .env.docker.example     ← template Laravel env untuk stack Docker
```

---

## 1. Prasyarat

| Tool | Minimal |
| --- | --- |
| Docker Desktop | 4.30+ |
| Docker Compose | v2 (sudah bundle di Desktop) |
| RAM tersedia | 4 GB |
| Port bebas di host | `8000`, `5173`, `5432`, `6379` |

---

## 2. Cara Pakai (Quickstart)

```bash
# 1. masuk ke folder project (root, BUKAN src)
cd pandaeducation

# 2. (opsional) salin env compose
cp .env.example .env

# 3. (opsional) salin env Laravel khusus Docker
cp src/.env.docker.example src/.env

# 4. build & jalankan stack
docker compose up --build
```

Setelah entrypoint selesai (lihat animasi di terminal), buka:

| Service | URL |
| --- | --- |
| Laravel app | http://localhost:8000 |
| Vite dev server (HMR) | http://localhost:5173 |
| PostgreSQL | `localhost:5432` (user `panda`, pass `panda_secret`, db `pandaeducation`) |
| Redis | `localhost:6379` |

> **Catatan:** Pertama kali build agak lama (composer install + npm install).
> Run berikutnya jauh lebih cepat karena `vendor/` dan `node_modules/` disimpan
> di named volume.

---

## 3. Yang Dilakukan Entrypoint

`docker/entrypoint.sh` menjalankan 12 langkah pra-boot dengan output animasi:

1. **Project files** — pastikan `composer.json` & `package.json` ter-mount.
2. **Environment file** — buat `.env` dari `.env.example` bila belum ada,
   lalu tampilkan `APP_ENV` (production / development).
3. **Runtime versions** — PHP, Composer, Node.js, npm.
4. **Database connection** — tunggu sampai port Postgres siap.
5. **Redis connection** — tunggu sampai port Redis siap.
6. **Composer dependencies** — `composer install` (jika perlu) lalu
   `composer dump-autoload --optimize`.
7. **Node modules** — `npm install` jika `node_modules/` kosong.
8. **Application key** — `php artisan key:generate` jika `APP_KEY` kosong.
9. **Storage symlink** — `php artisan storage:link`.
10. **Migrations** — `php artisan migrate --force`.
11. **Cache clearing** — `config/cache/route/view:clear`.
12. **Permissions** — `storage/` & `bootstrap/cache/` writable.

Setelah semua hijau, container otomatis menjalankan:

```
php artisan serve --host=0.0.0.0 --port=8000   # Laravel
npm run dev -- --host 0.0.0.0 --port 5173      # Vite
```

di-run paralel via `concurrently` (sudah ada di `devDependencies`).

---

## 4. Perintah Sehari-hari

```bash
# Lihat logs (interleaved laravel + vite)
docker compose logs -f app

# Masuk ke shell container
docker compose exec app bash

# Jalankan artisan
docker compose exec app php artisan tinker
docker compose exec app php artisan make:model Course -m

# Jalankan composer / npm
docker compose exec app composer require some/package
docker compose exec app npm install lodash

# Restart cuma service app
docker compose restart app

# Stop semua
docker compose down

# Stop + hapus volume (reset DB, node_modules, vendor)
docker compose down -v
```

### Mode override dari entrypoint

Default `CMD` adalah `dev`. Bisa diganti:

```bash
docker compose run --rm app serve   # cuma artisan serve
docker compose run --rm app vite    # cuma vite
docker compose run --rm app bash    # shell saja
docker compose run --rm app php artisan migrate:status
```

---

## 5. Troubleshooting

| Masalah | Solusi |
| --- | --- |
| Port 8000 / 5173 sudah dipakai | Edit `.env` (root): ubah `APP_PORT` / `VITE_PORT`. |
| Vite tidak me-refresh di browser | Pastikan akses lewat `http://localhost:5173`, bukan IP lain. |
| `vendor/` atau `node_modules/` korup | `docker compose down -v` lalu `up --build`. |
| Migrasi gagal connection refused | Tunggu beberapa detik — postgres healthcheck bisa lambat di run pertama. |
| File permission storage error | `docker compose exec app chmod -R ug+rwX storage bootstrap/cache`. |

---

## 6. Catatan untuk Production

Setup ini **khusus development** (`php artisan serve` + `vite` HMR). Untuk
production gunakan FPM + Nginx (atau Octane + Roadrunner/Swoole) dengan asset
hasil `npm run build`. Jangan deploy image ini apa adanya ke server publik.
