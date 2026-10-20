// Undangan Minimalist — server statis untuk development lokal.
// Data RSVP / ucapan disimpan di Firebase Firestore (lihat public/js/db.js).
const path = require('path');
const express = require('express');

const PORT = Number(process.env.PORT) || 3054;
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Undangan Minimalist berjalan di http://localhost:${PORT}  (contoh: /?to=Budi+Santoso)`);
});
