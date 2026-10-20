// ============================================================
//  SEMUA KONTEN UNDANGAN ADA DI SINI — cukup edit file ini.
//  Foto: taruh di public/images/ lalu sesuaikan path-nya.
//  Foto yang belum ada otomatis tampil sebagai placeholder.
//  (Isi di bawah adalah data CONTOH — ganti dengan data asli.)
// ============================================================
window.INVITATION = {
  couple: {
    short: ['Dimas', 'Alya'], // tampil besar di sampul, hero & penutup
    groom: {
      name: 'Dimas Arya Pratama',
      title: 'S.Ars.',
      parents: 'Putra pertama dari Bapak Haryanto & Ibu Ratna Dewi',
      instagram: 'dimasarya', // tanpa @ — kosongkan untuk menyembunyikan
      photo: 'images/groom.jpg',
    },
    bride: {
      name: 'Alya Kirana Putri',
      title: 'S.Ds.',
      parents: 'Putri kedua dari Bapak Wibowo Santoso & Ibu Melati Sari',
      instagram: 'alyakirana',
      photo: 'images/bride.jpg',
    },
  },

  // Tanggal utama (dipakai countdown) — format ISO lokal
  date: '2027-02-13T09:00:00+07:00',
  dateShort: '13.02.2027',
  dateLong: 'Sabtu, 13 Februari 2027',

  cover: {
    photo: 'images/cover.jpg',
    defaultGuest: 'Tamu Undangan', // dipakai bila tidak ada ?to=Nama di URL
  },

  hero: {
    photo: 'images/hero.jpg',
    kicker: 'Kami menikah',
  },

  // Paragraf besar yang "menyala" kata demi kata saat digulir
  quote: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum: 21',
  },

  // Teks berjalan (marquee) — dipisah titik tengah otomatis
  marquee: ['Save the date', 'Dimas & Alya', '13.02.2027', 'Jakarta'],

  story: [
    {
      year: '2019',
      title: 'Pertama bertemu',
      text: 'Sebuah studio desain kecil di Kemang mempertemukan kami — ia arsitek yang selalu terlambat rapat, saya desainer yang selalu menunggu.',
      photo: 'images/gallery-hands.jpg',
    },
    {
      year: '2021',
      title: 'Jarak & jeda',
      text: 'Dua tahun berbeda kota. Kami belajar bahwa sederhana itu cukup: satu panggilan setiap malam, dan janji untuk pulang.',
      photo: 'images/gallery-forest.jpg',
    },
    {
      year: '2025',
      title: 'Lamaran',
      text: 'Di meja makan keluarga, tanpa banyak kata. Sebuah cincin, dua keluarga, dan satu jawaban: iya.',
      photo: 'images/gallery-rings.jpg',
    },
    {
      year: '2027',
      title: 'Hari ini',
      text: 'Babak baru dimulai. Terima kasih telah menjadi bagian dari perjalanan kami sampai di titik ini.',
      photo: 'images/gallery-aisle.jpg',
    },
  ],

  events: [
    {
      label: 'Akad Nikah',
      date: 'Sabtu, 13 Februari 2027',
      time: '09.00 — 10.30 WIB',
      venue: 'Masjid Cut Meutia',
      address: 'Jl. Cut Meutia No. 1, Menteng, Jakarta Pusat',
      // Lokasi untuk preview peta: alamat, nama tempat, atau koordinat "lat,lng"
      mapQuery: 'Masjid Cut Meutia Jakarta',
      // Link tombol "Buka peta" (opsional — kosongkan agar otomatis dari mapQuery)
      map: '',
    },
    {
      label: 'Resepsi',
      date: 'Sabtu, 13 Februari 2027',
      time: '18.30 — 21.00 WIB',
      venue: 'Gedung Arsip Nasional',
      address: 'Jl. Gajah Mada No. 111, Taman Sari, Jakarta Barat',
      mapQuery: 'Gedung Arsip Nasional Jakarta',
      map: '',
    },
  ],

  dressCode: 'Busana formal bernuansa netral — putih gading, krem, atau abu muda.',

  gallery: [
    'images/gallery-smile.jpg',
    'images/gallery-veil.jpg',
    'images/gallery-hands.jpg',
    'images/gallery-shoes.jpg',
    'images/gallery-aisle.jpg',
    'images/gallery-forest.jpg',
    'images/gallery-rings.jpg',
  ],

  gift: {
    // Rekening & e-wallet — tambah / hapus baris sesuai kebutuhan.
    // type: 'bank' (Transfer bank) atau 'ewallet' (E-wallet)
    // logo: gambar di public/images/ (png/jpg/svg) — kosongkan untuk tanpa logo
    accounts: [
      { type: 'bank', name: 'BCA', number: '5270 1234 56', holder: 'Dimas Arya Pratama', logo: '' },
      { type: 'bank', name: 'Mandiri', number: '1240 0098 7654 3', holder: 'Alya Kirana Putri', logo: '' },
      { type: 'ewallet', name: 'GoPay', number: '0812 9876 5432', holder: 'Alya Kirana Putri', logo: '' },
    ],
    qris: '', // isi 'images/qris.png' bila sudah ada gambar QRIS
    address: 'Jl. Kemang Raya No. 18, Bangka, Mampang Prapatan, Jakarta Selatan 12730',
    addressRecipient: 'Alya Kirana Putri',
  },

  closing: {
    photo: 'images/closing.jpg',
    title: 'Terima kasih',
    text: 'Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.',
  },

  // Tag WhatsApp di footer — nomor format bebas (0812…, +62 812…, 62812…).
  // Kosongkan whatsapp ('') untuk menyembunyikan tag.
  contact: {
    whatsapp: '085920063749',
    message: 'Halo HEAVEN, saya tertarik membuat undangan digital.',
  },

  // Taruh file musik di public/audio/ — '' untuk menonaktifkan
  music: 'audio/gymnopedie.mp3',
};
