# undangan-minimalist

Undangan pernikahan digital bergaya minimalis-editorial dengan animasi GSAP yang kaya.
Arsitektur sama dengan `undangan-lintang` / `undangan-netflix` / `undangan-kejawen`:
frontend vanilla di `public/`, server statis Express, RSVP & ucapan di Firebase Firestore.
Bahasa visual & pola gerak diambil dari `heaven-inv` (palet canvas/ink/accent, hairline 1px,
huruf menyala acak, spasi huruf merapat, tombol magnetik, garis progres baca).

## Animasi (`public/js/motion.js`)

- Preloader: hitungan 0–100% + garis, lalu tirai naik
- Sampul: huruf nama menyala acak + spasi huruf merapat, foto kecil terbuka dari tengah
- Buka undangan: sampul terangkat, foto hero zoom-out, judul menyala
- Garis progres baca, indeks bagian di pojok kiri bawah (teks bergulir)
- Judul bagian SplitText, reveal per baris (ScrollTrigger.batch), hairline tergambar
- Ayat: kata demi kata menyala mengikuti gulir (scrub)
- Marquee: arah & kecepatan mengikuti arah/kecepatan gulir
- Foto mempelai: tirai dari bawah + paralaks
- Countdown: angka berguling setiap berubah
- Cerita: gulir horizontal ter-pin di desktop (≥900px), vertikal di HP
- Galeri: tirai bertahap, kursor bulat "Lihat", lightbox dengan transisi Flip dari thumbnail
- Tombol magnetik, teks tombol berguling, pil RSVP bergeser, centang tergambar
- Penutup: spasi huruf judul merapat mengikuti gulir

Reduced motion / GSAP gagal dimuat → semua konten langsung tampil tanpa gerak.
GSAP 3.15 disimpan lokal di `public/js/vendor/` (lisensi standar GSAP, gratis).

## Mengedit konten

Semua teks, tanggal, foto, rekening ada di `public/js/config.js`.
Foto ditaruh di `public/images/` — file yang belum ada tampil sebagai placeholder.

## Aset

Foto: Unsplash via Wikimedia Commons (CC0). Musik: Satie *Gymnopédie No. 1*, rekaman domain
publik. Daftar lengkap di `public/kredit.html` dan `CREDITS.md`. Foto mempelai & galeri hanya
CONTOH — ganti dengan foto pasangan asli.

## Firebase

1. Buat project Firebase + Firestore, salin config web ke `public/js/firebase-config.js`.
2. Publish `firestore.rules` (`firebase deploy --only firestore:rules`).

Selama `apiKey` masih `ISI_...`, RSVP berjalan dalam **mode demo** (tersimpan di
localStorage perangkat sendiri, tidak terlihat tamu lain).

## Menjalankan

```bash
npm install
npm start
```

Buka http://localhost:3054/?to=Budi+Santoso
