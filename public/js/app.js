// Konten, state & interaksi dasar. Semua animasi GSAP ada di motion.js
// (app.js tetap berfungsi penuh tanpa motion.js / dengan reduced motion).
(() => {
  const C = window.INVITATION;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const get = (path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), C);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const motion = () => window.__motion; // diisi motion.js bila animasi aktif

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; // selalu mulai dari sampul
  const [nameA, nameB] = C.couple.short;
  document.title = `The Wedding of ${nameA} & ${nameB}`;

  // ---------- teks & nama ----------
  $$('[data-text]').forEach((el) => {
    const v = get(el.dataset.text);
    if (v) el.textContent = v; else el.hidden = true;
  });
  $$('[data-short]').forEach((el) => { el.textContent = C.couple.short[el.dataset.short] ?? ''; });
  $$('[data-names]').forEach((el) => { el.innerHTML = `${esc(nameA)}<em class="amp">&amp;</em>${esc(nameB)}`; });
  $$('[data-mono]').forEach((el) => { el.innerHTML = `${esc(nameA.charAt(0))}<em>&amp;</em>${esc(nameB.charAt(0))}`; });

  // ---------- foto (dengan placeholder bila file belum ada) ----------
  const phLabel = (src) => (src || '').split('/').pop() || 'foto';
  function setPhoto(img, src) {
    const holder = img.parentElement;
    const fail = () => {
      img.classList.add('ph-img');
      holder.classList.add('ph');
      holder.dataset.ph = phLabel(src);
    };
    if (!src) return fail();
    img.addEventListener('error', fail, { once: true });
    img.src = src;
  }
  $$('[data-photo]').forEach((el) => setPhoto(el, get(el.dataset.photo)));

  // ---------- nama tamu (?to=Nama) ----------
  const guest = new URLSearchParams(location.search).get('to');
  $('#guestName').textContent = guest ? guest.slice(0, 60) : C.cover.defaultGuest;
  if (guest) $('#rsvpName').value = guest.slice(0, 60);

  // ---------- instagram ----------
  ['groom', 'bride'].forEach((who) => {
    const a = $(`[data-ig="${who}"]`);
    const ig = String(C.couple[who].instagram || '').replace(/^@/, '');
    if (!a || !ig) return;
    a.href = `https://instagram.com/${encodeURIComponent(ig)}`;
    a.textContent = `@${ig}`;
    a.hidden = false;
  });

  // ---------- musik ----------
  const audio = $('#bgm');
  const musicBtn = $('#musicBtn');
  if (C.music) {
    audio.src = C.music;
    audio.addEventListener('error', () => { musicBtn.hidden = true; });
    audio.addEventListener('play', () => musicBtn.classList.add('playing'));
    audio.addEventListener('pause', () => musicBtn.classList.remove('playing'));
    musicBtn.addEventListener('click', () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  }

  // ---------- buka undangan ----------
  const cover = $('#cover');
  $('#openBtn').addEventListener('click', () => {
    cover.classList.add('opened'); // tirai naik (transisi CSS)
    document.body.classList.remove('locked');
    document.documentElement.classList.add('started');
    window.scrollTo(0, 0);
    if (C.music) {
      musicBtn.hidden = false;
      audio.play().catch(() => {});
    }
    window.dispatchEvent(new Event('invite-open'));
    setTimeout(() => { cover.style.display = 'none'; }, 1300);
  });

  // ---------- countdown (angka "berguling" bila motion aktif) ----------
  const target = new Date(C.date).getTime();
  const cd = Object.fromEntries($$('[data-cd]').map((el) => [el.dataset.cd, el]));
  const pad = (n) => String(n).padStart(2, '0');
  function setUnit(el, v) {
    if (el.dataset.v === v) return;
    const first = el.dataset.v === undefined;
    el.dataset.v = v;
    if (!first && motion()?.roll) motion().roll(el, v);
    else el.innerHTML = `<span>${v}</span>`;
  }
  function tick() {
    const diff = Math.max(target - Date.now(), 0);
    const s = Math.floor(diff / 1000);
    setUnit(cd.d, pad(Math.floor(s / 86400)));
    setUnit(cd.h, pad(Math.floor((s % 86400) / 3600)));
    setUnit(cd.m, pad(Math.floor((s % 3600) / 60)));
    setUnit(cd.s, pad(s % 60));
  }
  tick();
  setInterval(tick, 1000);

  // Simpan ke Google Calendar (acara pertama, durasi 4 jam dari `date`)
  const stamp = (t) => new Date(t).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const ev0 = (C.events || [])[0] || {};
  $('#calLink').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${nameA} & ${nameB}`,
    dates: `${stamp(target)}/${stamp(target + 4 * 3600e3)}`,
    location: [ev0.venue, ev0.address].filter(Boolean).join(', '),
  });

  // ---------- marquee (diulang supaya putaran mulus) ----------
  const words = (C.marquee || []).map((w) => `<span>${esc(w)}</span>`).join('');
  $('#marquee').innerHTML = words.repeat(4);

  // ---------- cerita ----------
  $('#story').innerHTML = (C.story || []).map((s) => `
    <li class="story-card">
      ${s.photo ? `<div class="story-photo" data-reveal><img alt="" /></div>` : ''}
      <span class="story-year" data-reveal>${esc(s.year)}</span>
      <h3 data-reveal>${esc(s.title)}</h3>
      <p data-reveal>${esc(s.text)}</p>
    </li>`).join('');
  $$('#story .story-card').forEach((li, i) => {
    const img = $('img', li);
    if (img) setPhoto(img, C.story[i].photo);
  });

  // ---------- acara (peta dibuka seperti akordeon) ----------
  const mapQ = (e) => e.mapQuery || [e.venue, e.address].filter(Boolean).join(', ');
  $('#eventList').innerHTML = (C.events || []).map((e, i) => `
    <article class="event" data-event>
      <div class="ev-row">
        <h3 class="ev-label" data-reveal>${esc(e.label)}</h3>
        <p class="ev-when" data-reveal><b>${esc(e.date)}</b><span>${esc(e.time)}</span></p>
        <p class="ev-where" data-reveal><b>${esc(e.venue)}</b><span>${esc(e.address)}</span></p>
        <div class="ev-actions" data-reveal>
          <button class="text-link ev-toggle" type="button" aria-expanded="false" aria-controls="map${i}">Peta <span aria-hidden="true">+</span></button>
          <a class="text-link" href="${esc(e.map || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapQ(e)))}" target="_blank" rel="noopener">Buka peta <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div class="ev-map" id="map${i}"><div><iframe data-src="https://maps.google.com/maps?q=${encodeURIComponent(mapQ(e))}&z=15&output=embed"
        title="Peta lokasi ${esc(e.label)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div>
    </article>`).join('');
  $('#eventList').addEventListener('click', (e) => {
    const btn = e.target.closest('.ev-toggle');
    if (!btn) return;
    const card = btn.closest('.event');
    const frame = $('iframe', card);
    if (!frame.src) frame.src = frame.dataset.src; // muat peta saat pertama dibuka
    const open = card.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    setTimeout(() => window.ScrollTrigger?.refresh(), 850);
  });

  // ---------- galeri + lightbox ----------
  const gal = $('#gallery');
  const shots = C.gallery || [];
  if (!shots.length) $('#gallery-sec').hidden = true;
  $('#frameCount').textContent = `${pad(shots.length)} frame`;
  gal.innerHTML = shots.map((_, i) => `<button type="button" data-i="${i}" data-cursor="Lihat" aria-label="Buka foto ${i + 1}"><img alt="Galeri ${i + 1}" loading="lazy" /></button>`).join('');
  $$('img', gal).forEach((img, i) => setPhoto(img, shots[i]));

  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  const lbCount = $('#lbCount');
  let cur = 0;
  const available = () => $$('button', gal).filter((b) => !b.classList.contains('ph')).map((b) => Number(b.dataset.i));
  const showAt = (i) => {
    cur = i;
    lbImg.src = shots[cur];
    lbCount.textContent = `${pad(available().indexOf(cur) + 1)} / ${pad(available().length)}`;
  };
  async function open(i, fromImg) {
    if (!available().includes(i)) return;
    showAt(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    try { await lbImg.decode(); } catch { /* tetap tampil */ }
    motion()?.flipIn?.(fromImg, lbImg);
  }
  function close() {
    const done = () => { lb.hidden = true; document.body.style.overflow = ''; };
    motion()?.fadeOut ? motion().fadeOut(lb, done) : done();
  }
  function step(d) {
    const list = available();
    showAt(list[(list.indexOf(cur) + d + list.length) % list.length]);
    motion()?.swap?.(lbImg, d);
  }
  gal.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && !b.classList.contains('ph')) open(Number(b.dataset.i), $('img', b));
  });
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-nav.prev', lb).addEventListener('click', () => step(-1));
  $('.lb-nav.next', lb).addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // ---------- hadiah ----------
  const g = C.gift || {};
  const cards = [];
  // Logo diatur lewat `logo` di config.js (file di public/images/).
  // File kosong / tidak ditemukan → kotak logo disembunyikan.
  const logoHTML = (src, alt) => (src
    ? `<span class="gift-logo"><img src="${esc(src)}" alt="${esc(alt)}" onerror="this.parentNode.remove()" /></span>`
    : '');
  const giftSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></svg>`;
  const copyBtn = (value, label) => `
    <button class="btn copy" type="button" data-copy="${esc(value)}" data-magnetic>
      <span class="btn-roll"><span>${label}</span><span aria-hidden="true">Tersalin ✓</span></span>
    </button>`;
  (g.accounts || []).forEach((a) => {
    const wallet = a.type === 'ewallet';
    cards.push(`
    <article class="gift" data-reveal>
      <div class="gift-head">
        <p class="label">${wallet ? 'E-wallet' : 'Transfer bank'}</p>
        ${logoHTML(a.logo, 'Logo ' + a.name)}
      </div>
      <h3>${esc(a.name)}</h3>
      <p class="acc">${esc(a.number)}</p>
      <p class="holder">a.n. ${esc(a.holder)}</p>
      ${copyBtn(String(a.number).replace(/[\s-]/g, ''), 'Salin nomor')}
    </article>`);
  });
  if (g.qris) cards.push(`
    <article class="gift" data-reveal>
      <p class="label">Pembayaran digital</p>
      <h3>QRIS</h3>
      <div class="qris-wrap"><img class="qris" alt="Kode QRIS" data-qris /></div>
    </article>`);
  if (g.address) cards.push(`
    <article class="gift" data-reveal>
      <div class="gift-head">
        <p class="label">Kirim kado</p>
        <span class="gift-icon">${giftSvg}</span>
      </div>
      <h3>Alamat</h3>
      <address>${esc(g.addressRecipient ? g.addressRecipient + ' — ' : '')}${esc(g.address)}</address>
      ${copyBtn(g.address, 'Salin alamat')}
    </article>`);
  $('#gifts').innerHTML = cards.join('');
  const qris = $('[data-qris]');
  if (qris) setPhoto(qris, g.qris);

  const toast = $('#toast');
  let toastT;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.classList.add('copied');
      setTimeout(() => b.classList.remove('copied'), 1800);
    } catch {
      notify('Gagal menyalin — salin manual ya');
    }
  });

  // ---------- RSVP & buku tamu ----------
  const form = $('#rsvpForm');
  const msg = $('#rsvpMsg');
  const guestsField = $('#guestsField');
  form.addEventListener('change', (e) => {
    if (e.target.name === 'attendance') guestsField.hidden = e.target.value === 'tidak';
  });

  const list = $('#wishes');
  const more = $('#moreWishes');
  const PAGE = 10;
  let cursor = null;
  const fmtTime = (d) => (d ? d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
  const wishHTML = (w) => `
    <li>
      <div class="wish-top">
        <span class="wish-name">${esc(w.name)}</span>
        <span class="wish-tag">${w.attendance === 'hadir' ? 'Hadir' : 'Berhalangan'}</span>
      </div>
      <p class="wish-msg">${esc(w.message)}</p>
      <p class="wish-time">${esc(fmtTime(w.createdAt))}</p>
    </li>`;

  // db.js (ES module, Firebase) memasang window.RSVP_DB lalu memicu 'db-ready'
  const dbReady = new Promise((resolve, reject) => {
    if (window.RSVP_DB) return resolve(window.RSVP_DB);
    window.addEventListener('db-ready', () => resolve(window.RSVP_DB), { once: true });
    setTimeout(() => reject(new Error('Koneksi database gagal dimuat.')), 15000);
  });

  // Firestore bisa "menggantung" (mis. database belum dibuat / offline) — beri batas waktu
  const withTimeout = (p, ms = 12000) => Promise.race([
    p, new Promise((_, rej) => setTimeout(() => rej(new Error('Buku tamu belum dapat dimuat.')), ms)),
  ]);

  async function loadStats() {
    try {
      const db = await dbReady;
      const { hadir, tidak, ucapan } = await withTimeout(db.stats());
      $('#gbStats').textContent = `${hadir} hadir · ${tidak} berhalangan · ${ucapan} ucapan${db.demo ? ' · mode demo' : ''}`;
    } catch { $('#gbStats').textContent = ''; }
  }

  async function loadWishes(reset) {
    if (reset) { cursor = null; list.innerHTML = '<li class="empty">Memuat ucapan…</li>'; }
    more.disabled = true;
    try {
      const db = await dbReady;
      const res = await withTimeout(db.page(PAGE, cursor));
      cursor = res.cursor;
      list.querySelector('.empty')?.remove();
      const before = list.children.length;
      list.insertAdjacentHTML('beforeend', res.items.map(wishHTML).join(''));
      motion()?.stagger?.([...list.children].slice(before));
      more.hidden = res.done;
      if (!list.children.length) list.innerHTML = '<li class="empty">Belum ada ucapan. Jadilah yang pertama.</li>';
    } catch (err) {
      console.error(err);
      if (reset) list.innerHTML = `<li class="empty">${esc(err.message || 'Buku tamu belum dapat dimuat.')}</li>`;
      more.hidden = true;
    } finally {
      more.disabled = false;
    }
  }
  more.addEventListener('click', () => loadWishes(false));
  loadWishes(true);
  loadStats();

  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    msg.className = 'form-msg';
    if (!data.name?.trim()) { msg.textContent = 'Mohon isi nama Anda.'; return; }
    if (!data.attendance) { msg.textContent = 'Mohon pilih konfirmasi kehadiran.'; return; }
    const btn = $('button[type=submit]', form);
    btn.disabled = true;
    try {
      await withTimeout((await dbReady).add(data), 15000);
      msg.innerHTML = `${check}<span>Terima kasih — konfirmasi Anda sudah kami terima.</span>`;
      msg.classList.add('ok');
      form.message.value = '';
      loadWishes(true);
      loadStats();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Gagal mengirim, coba lagi.';
    } finally {
      btn.disabled = false;
    }
  });

  // ---------- tag WhatsApp (footer) ----------
  (() => {
    const tag = $('#waTag');
    const raw = String(C.contact?.whatsapp ?? '').replace(/\D/g, '');
    if (!tag || !raw) return;
    const num = raw.startsWith('62') ? raw : raw.startsWith('0') ? `62${raw.slice(1)}` : `62${raw}`;
    const text = C.contact.message ? `?text=${encodeURIComponent(C.contact.message)}` : '';
    tag.href = `https://wa.me/${num}${text}`;
    const loc = `0${num.slice(2)}`;
    $('span', tag).textContent = loc.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    tag.setAttribute('aria-label', `Hubungi via WhatsApp ${loc}`);
    tag.hidden = false;
  })();
})();
