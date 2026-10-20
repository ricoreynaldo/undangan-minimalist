// Semua animasi GSAP (ScrollTrigger, SplitText, Flip) — pola gerak mengikuti heaven-inv:
// huruf menyala acak, spasi huruf merapat, reveal per baris, tombol magnetik,
// garis progres baca. Aktif hanya bila <html class="motion"> (tanpa reduced motion).
(() => {
  const html = document.documentElement;
  const { gsap, ScrollTrigger, SplitText, Flip } = window;
  if (!gsap || !ScrollTrigger || !SplitText || !html.classList.contains('motion')) {
    html.classList.remove('motion');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const M = { fast: 0.2, base: 0.4, slow: 0.6, stagger: 0.06, ease: 'power3.out', expo: 'expo.out', io: 'expo.inOut', rise: 16, magnet: 0.3 };
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const WIDE = matchMedia('(min-width: 768px)').matches;
  const api = (window.__motion = {});

  // Huruf menyala dalam urutan acak (SplitText chars). Mengembalikan tween.
  const randomChars = (el, vars = {}) => {
    gsap.set(el, { autoAlpha: 1 });
    const split = SplitText.create(el, { type: 'words,chars' });
    return gsap.from(split.chars, { opacity: 0, duration: 0.6, ease: 'power2.out', stagger: { amount: 0.9, from: 'random' }, ...vars });
  };

  // ============ 1. PRELOADER ============
  const loader = $('#loader');
  const count = $('#loaderCount');
  const bar = $('#loaderBar');
  const waitImg = (img) => new Promise((res) => {
    if (!img || img.complete) return res();
    img.addEventListener('load', res, { once: true });
    img.addEventListener('error', res, { once: true });
  });
  const assets = Promise.race([
    Promise.all([waitImg($('.ct-photo img')), waitImg($('[data-hero-img]')), document.fonts?.ready]),
    new Promise((r) => setTimeout(r, 5000)),
  ]);
  const prog = { v: 0 };
  const render = () => { count.textContent = Math.round(prog.v); gsap.set(bar, { scaleX: prog.v / 100 }); };
  const loading = gsap.to(prog, { v: 86, duration: 1.6, ease: 'power2.out', onUpdate: render });
  gsap.from('.loader-mono', { autoAlpha: 0, letterSpacing: '0.8em', duration: 1.4, ease: M.expo });
  Promise.all([assets, new Promise((r) => setTimeout(r, 1300))]).then(() => {
    loading.kill();
    gsap.timeline()
      .to(prog, { v: 100, duration: 0.5, ease: 'power2.inOut', onUpdate: render })
      .to(loader, { yPercent: -100, duration: 1.1, ease: M.io }, '+=0.15')
      .add(coverIn, '-=0.55')
      .set(loader, { display: 'none' });
  });

  // ============ 2. SAMPUL ============
  function coverIn() {
    const title = $('[data-cover-title]');
    const names = $$('.ct-name', title);
    gsap.set(title, { autoAlpha: 1 });
    names.forEach((n, i) => randomChars(n, { delay: 0.1 + i * 0.15 }));
    if (WIDE) gsap.from(names, { letterSpacing: '0.42em', duration: 1.8, ease: M.expo, delay: 0.1, clearProps: 'letterSpacing' });
    gsap.from('.ct-amp', { autoAlpha: 0, rotate: -20, duration: 1.2, ease: M.expo, delay: 0.5 });
    gsap.fromTo('.ct-photo', { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.4, ease: M.io, delay: 0.35 });
    gsap.from('.ct-photo img', { scale: 1.5, duration: 1.8, ease: M.expo, delay: 0.35 });
    gsap.fromTo('[data-cover-item]', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: M.slow, ease: M.ease, stagger: 0.08, delay: 0.9, clearProps: 'transform' });
  }

  // ============ 3. HERO (setelah sampul dibuka) ============
  window.addEventListener('invite-open', () => {
    ScrollTrigger.refresh();
    const tl = gsap.timeline({ delay: 0.35 });
    tl.fromTo('[data-hero-img]', { scale: 1.35 }, { scale: 1, duration: 2.2, ease: M.expo }, 0)
      .add(randomChars($('[data-hero-title]'), { delay: 0 }), 0.3)
      .fromTo('[data-hero-item]', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: M.slow, ease: M.ease, stagger: 0.1, clearProps: 'transform' }, 0.8);
    if (WIDE) gsap.from('[data-hero-title]', { letterSpacing: '0.3em', duration: 2, ease: M.expo, delay: 0.35, clearProps: 'letterSpacing' });
  }, { once: true });

  // Paralaks hero: foto turun pelan, teks memudar saat digulir
  gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-text', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });

  // ============ 4. PROGRES BACA ============
  const setProgress = gsap.quickSetter('#progress', 'scaleX');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => setProgress(s.progress), onRefresh: (s) => setProgress(s.progress) });

  // ============ 5. JUDUL & REVEAL ============
  $$('[data-split]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    const split = SplitText.create(el, { type: 'words,chars' });
    gsap.from(split.chars, { opacity: 0, duration: 0.5, ease: 'power2.out', stagger: { amount: 0.6, from: 'random' }, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  const revealItems = $$('[data-reveal]');
  gsap.set(revealItems, { autoAlpha: 0, y: M.rise });
  ScrollTrigger.batch(revealItems, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: M.base * 2, ease: M.ease, stagger: M.stagger, overwrite: true, clearProps: 'transform' }),
  });

  // Garis hairline digambar dari kiri
  $$('.sec-head, .event').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => el.classList.add('drawn'),
    });
  });

  // Foto masuk dengan tirai dari bawah + paralaks di dalam bingkai
  $$('[data-clip]').forEach((box) => {
    const img = $('img', box);
    gsap.timeline({ scrollTrigger: { trigger: box, start: 'top 85%', once: true } })
      .to(box, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: M.io })
      .from(img, { scale: 1.3, duration: 1.8, ease: M.expo }, 0);
  });
  $$('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // ============ 6. AYAT: kata menyala sesuai posisi gulir ============
  const quote = $('#quote');
  if (quote) {
    const words = SplitText.create(quote, { type: 'words' }).words;
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  }

  // ============ 7. MARQUEE: arah & kecepatan ikut gulir ============
  const track = $('#marquee');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        dir = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 220, 6);
        gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out', delay: 0.25 });
      },
    });
  }

  // ============ 8. COUNTDOWN: angka berguling ============
  api.roll = (el, v) => {
    const old = el.lastElementChild;
    const nu = document.createElement('span');
    nu.textContent = v;
    el.appendChild(nu);
    gsap.fromTo(nu, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: M.expo });
    if (old) gsap.to(old, { yPercent: -100, duration: 0.7, ease: M.expo, onComplete: () => old.remove() });
  };

  // ============ 9. CERITA: gulir horizontal ter-pin (desktop) ============
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const storyTrack = $('#story');
    const distance = () => Math.max(storyTrack.scrollWidth - window.innerWidth, 0);
    const tween = gsap.to(storyTrack, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.story-pin',
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (s) => gsap.set('#storyBar', { scaleX: s.progress }),
      },
    });
    // foto tiap kartu sedikit bergeser di dalam bingkainya selama gulir horizontal
    $$('.story-photo img', storyTrack).forEach((img) => {
      gsap.fromTo(img, { xPercent: -6, scale: 1.12 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
  });

  // ============ 10. GALERI: tirai bertahap + kursor "Lihat" ============
  const tiles = $$('#gallery button');
  gsap.set(tiles, { clipPath: 'inset(100% 0 0 0)' });
  ScrollTrigger.batch(tiles, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: M.io, stagger: 0.12 }),
  });

  if (FINE) {
    const cursor = $('#cursor');
    const label = $('span', cursor);
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: M.ease });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: M.ease });
    let active = null;
    document.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target.closest?.('[data-cursor]');
      if (t === active) return;
      active = t;
      if (t) label.textContent = t.dataset.cursor;
      gsap.to(cursor, { scale: t ? 1 : 0, duration: 0.5, ease: M.expo, overwrite: 'auto' });
    }, { passive: true });
  }

  // ============ 11. TOMBOL MAGNETIK ============
  if (FINE) {
    const movers = new WeakMap();
    let current = null;
    const moverFor = (el) => {
      if (!movers.has(el)) movers.set(el, { x: gsap.quickTo(el, 'x', { duration: M.base, ease: M.ease }), y: gsap.quickTo(el, 'y', { duration: M.base, ease: M.ease }) });
      return movers.get(el);
    };
    const release = (el) => { const m = movers.get(el); m?.x(0); m?.y(0); };
    document.addEventListener('pointermove', (e) => {
      const t = e.target.closest?.('[data-magnetic]');
      if (current && current !== t) release(current);
      current = t;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const m = moverFor(t);
      m.x((e.clientX - (r.left + r.width / 2)) * M.magnet);
      m.y((e.clientY - (r.top + r.height / 2)) * M.magnet);
    }, { passive: true });
  }

  // ============ 12. PENUTUP: spasi huruf merapat mengikuti gulir ============
  gsap.fromTo('[data-closing-img]', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  gsap.fromTo('[data-closing-title]', { letterSpacing: '0.5em', opacity: 0.2 }, { letterSpacing: '0.04em', opacity: 1, ease: 'none', scrollTrigger: { trigger: '.closing', start: 'top 85%', end: 'top 10%', scrub: true } });

  // ============ 13. INDEKS BAGIAN (pojok kiri bawah) ============
  const indexText = $('#indexText');
  let currentIndex = indexText.textContent;
  const setIndex = (txt, dir) => {
    if (txt === currentIndex) return;
    currentIndex = txt;
    gsap.timeline()
      .to(indexText, { yPercent: dir > 0 ? -110 : 110, duration: 0.25, ease: 'power2.in' })
      .set(indexText, { textContent: txt, yPercent: dir > 0 ? 110 : -110 })
      .to(indexText, { yPercent: 0, duration: 0.45, ease: M.expo });
  };
  $$('[data-index]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setIndex(sec.dataset.index, self.direction); },
    });
  });

  // ============ 14. LIGHTBOX (Flip dari thumbnail) & daftar ucapan ============
  api.flipIn = (thumb, big) => {
    const lb = big.closest('.lightbox');
    gsap.to('#cursor', { scale: 0, duration: 0.3, overwrite: 'auto' });
    gsap.fromTo(lb, { backgroundColor: 'rgba(250,249,246,0)' }, { backgroundColor: 'rgba(250,249,246,1)', duration: 0.5, ease: M.ease });
    gsap.fromTo($$('button, .lb-count', lb), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.4 });
    if (!thumb || !Flip) return;
    gsap.from(big, { ...Flip.fit(big, thumb, { getVars: true, scale: true }), duration: 0.9, ease: M.io });
  };
  api.swap = (big, d) => gsap.fromTo(big, { autoAlpha: 0, x: 40 * d }, { autoAlpha: 1, x: 0, duration: 0.6, ease: M.expo });
  api.fadeOut = (lb, done) => gsap.to(lb, { autoAlpha: 0, duration: 0.35, ease: 'power2.in', onComplete: () => { gsap.set(lb, { clearProps: 'all' }); done(); } });
  api.stagger = (items) => gsap.from(items, { autoAlpha: 0, y: M.rise, duration: M.slow, ease: M.ease, stagger: M.stagger });

  // Tinggi halaman berubah setelah gambar/font termuat → ukur ulang
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
