/* ===========================
   RPL 1 2026 — script.js
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* ── Hamburger toggle ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ── Scroll fade-in ── */
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* ── Navbar scroll shadow ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.style.boxShadow = window.scrollY > 10
            ? '0 4px 24px rgba(0,0,0,0.5)'
            : 'none';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ── Stats counter animation ── */
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';

    if (target <= 1) {
      el.textContent = target + suffix;
      return;
    }

    let count = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count + suffix;
    }, 25);
  });

  /* ═══════════════════════════════
     HORIZONTAL PHOTO SCROLL
     ═══════════════════════════════ */
  const track    = document.getElementById('scrollTrack');
  const btnLeft  = document.getElementById('scrollLeft');
  const btnRight = document.getElementById('scrollRight');

  if (track && btnLeft && btnRight) {

    const getScrollAmount = () => {
      return Math.round(track.querySelector('.scroll-item').offsetWidth + 20);
    };

    btnLeft.addEventListener('click', () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    btnRight.addEventListener('click', () => {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    const updateBtns = () => {
      btnLeft.style.opacity  = track.scrollLeft <= 5 ? '0.3' : '1';
      btnLeft.style.pointerEvents = track.scrollLeft <= 5 ? 'none' : 'auto';

      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      btnRight.style.opacity = atEnd ? '0.3' : '1';
      btnRight.style.pointerEvents = atEnd ? 'none' : 'auto';
    };

    track.addEventListener('scroll', () => {
      requestAnimationFrame(updateBtns);
    });

    updateBtns();

    let isDragging = false;
    let startX     = 0;
    let scrollStart = 0;
    let hasMoved   = false;

    track.addEventListener('mousedown', (e) => {
      isDragging  = true;
      hasMoved    = false;
      startX      = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
      track.style.cursor = 'grabbing';
      track.style.userSelect = 'none';
    });

    const stopDrag = () => {
      isDragging = false;
      track.style.cursor = '';
      track.style.userSelect = '';
    };

    track.addEventListener('mouseleave', stopDrag);
    track.addEventListener('mouseup', stopDrag);

    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) hasMoved = true;
      track.scrollLeft = scrollStart - walk;
    });

    track.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (hasMoved) e.preventDefault();
      });
    });

    let touchStartX = 0;
    let touchScrollStart = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX     = e.touches[0].pageX;
      touchScrollStart = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      const x    = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.2;
      track.scrollLeft = touchScrollStart + walk;
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      const rect = track.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        track.scrollBy({ left: 300, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        track.scrollBy({ left: -300, behavior: 'smooth' });
      }
    });
  }

  /* ═══════════════════════════════
     SMOOTH SCROLL untuk anchor (#)
     ═══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ═══════════════════════════════
     CARD HOVER TILT (subtle)
     ═══════════════════════════════ */
  document.querySelectorAll('.card, .activity-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});


/* ================================================
   SISWA — hanya jalan kalau elemen ada
   ================================================ */
(function() {
  var track = document.getElementById('carouselTrack');
  if (!track) return;

  var dotsWrap = document.getElementById('carouselDots');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var emptyState = document.getElementById('emptyState');
  var carouselContainer = document.getElementById('carouselContainer');
  var resultInfo = document.getElementById('resultInfo');

  var siswaData = [
    { nama: "Aditia", gender: "L" },
    { nama: "Afandi Mufti Fauzi", gender: "L" },
    { nama: "Ahdi Nur Ramdani", gender: "L" },
    { nama: "Andika Prasetia Prayoga", gender: "L" },
    { nama: "Andini", gender: "P" },
    { nama: "D Vina Maharani", gender: "P" },
    { nama: "Dede Rahmat", gender: "L" },
    { nama: "Dika Ananda", gender: "L" },
    { nama: "Dilviana Syahhila", gender: "P" },
    { nama: "Erika Kurnia Damayanti", gender: "P" },
    { nama: "Herdi Herdiana", gender: "L" },
    { nama: "Kaila Budiana Putri", gender: "P" },
    { nama: "Lia Nopita", gender: "P" },
    { nama: "Lisdia Martadiana", gender: "P" },
    { nama: "M Fachri Firmansyah", gender: "L" },
    { nama: "M Raifan Alfiansyah Hanapi", gender: "L" },
    { nama: "M Rendi Irawan", gender: "L" },
    { nama: "Marsia Tresna Rahayu", gender: "P" },
    { nama: "Mila Farhatul Ulia", gender: "P" },
    { nama: "Naisa Febriyanti", gender: "P" },
    { nama: "Naya Nur Amelia", gender: "P" },
    { nama: "Nurul Emilia", gender: "P" },
    { nama: "Puput Handayani", gender: "P" },
    { nama: "Raisa Riva Nazzahra", gender: "P" },
    { nama: "Renita Jailanti", gender: "P" },
    { nama: "Resa", gender: "P" },
    { nama: "Restu Ahmad Fauzan", gender: "L" },
    { nama: "Rifan Maulana", gender: "L" },
    { nama: "Risma Nuraeni Aprilia", gender: "P" },
    { nama: "Rizky Aditiya", gender: "L" },
    { nama: "Rizky Ardiansyah Nur Ramadhani", gender: "L" },
    { nama: "Rona Rosandi", gender: "L" },
    { nama: "Santi Nuraeni", gender: "P" },
    { nama: "Sena Patmawati", gender: "P" },
    { nama: "Seni Nurisma", gender: "P" }
  ];

  var currentPage = 0;
  var cardsPerPage = 5;
  var filteredData = siswaData.slice();
  var isDragging = false;
  var startX = 0;
  var currentTranslate = 0;
  var prevTranslate = 0;

  function getCardsPerPage() {
    var w = window.innerWidth;
    if (w < 500) return 2;
    if (w < 700) return 3;
    if (w < 1000) return 4;
    return 5;
  }

  function renderCards() {
    track.innerHTML = '';
    if (filteredData.length === 0) {
      if (emptyState) emptyState.classList.add('show');
      if (carouselContainer) carouselContainer.style.display = 'none';
      if (dotsWrap) dotsWrap.innerHTML = '';
      if (resultInfo) resultInfo.textContent = '';
      return;
    }
    if (emptyState) emptyState.classList.remove('show');
    if (carouselContainer) carouselContainer.style.display = '';
    filteredData.forEach(function(s) {
      var no = siswaData.indexOf(s) + 1;
      var genderClass = s.gender === 'L' ? 'laki' : 'perempuan';
      var genderLabel = s.gender === 'L' ? 'Laki-laki' : 'Perempuan';
      var card = document.createElement('div');
      card.className = 'siswa-card';
      card.innerHTML =
        '<div class="card-photo">' +
          '<img src="img/siswa/' + s.nama + '.jpeg" alt="' + s.nama + '" loading="lazy" />' +
          '<span class="card-no">' + no + '</span>' +
          '<span class="card-gender ' + genderClass + '">' + genderLabel + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-name">' + s.nama + '</div>' +
        '</div>';
      track.appendChild(card);
    });
    if (resultInfo) resultInfo.textContent = 'Menampilkan ' + filteredData.length + ' dari ' + siswaData.length + ' siswa';
  }

  function getTotalPages() { return Math.max(1, Math.ceil(filteredData.length / cardsPerPage)); }

  function goToPage(page) {
    var total = getTotalPages();
    if (page < 0) page = 0;
    if (page >= total) page = total - 1;
    currentPage = page;
    var cardWidth = track.firstElementChild ? track.firstElementChild.offsetWidth + 14 : 194;
    var offset = currentPage * cardsPerPage * cardWidth;
    currentTranslate = -offset;
    prevTranslate = currentTranslate;
    track.style.transform = 'translateX(' + currentTranslate + 'px)';
    if (btnPrev) btnPrev.disabled = currentPage === 0;
    if (btnNext) btnNext.disabled = currentPage >= total - 1;
    renderDots();
  }

  window.carouselPrev = function() { goToPage(currentPage - 1); };
  window.carouselNext = function() { goToPage(currentPage + 1); };
  window.goToPage = goToPage;
  window.handleSearch = function() {
    var input = document.getElementById('searchInput');
    var q = input ? input.value.toLowerCase().trim() : '';
    filteredData = q ? siswaData.filter(function(s) { return s.nama.toLowerCase().includes(q); }) : siswaData.slice();
    currentPage = 0;
    renderCards();
    requestAnimationFrame(function() { goToPage(0); });
  };

  function renderDots() {
    var total = getTotalPages();
    if (!dotsWrap) return;
    if (total <= 1) { dotsWrap.innerHTML = ''; return; }
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<button class="dot' + (i === currentPage ? ' active' : '') + '" onclick="goToPage(' + i + ')"></button>';
    }
    dotsWrap.innerHTML = html;
  }

  function dragStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    track.classList.add('dragging');
  }
  function dragMove(e) {
    if (!isDragging) return;
    var x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    currentTranslate = prevTranslate + (x - startX);
    track.style.transform = 'translateX(' + currentTranslate + 'px)';
  }
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    var moved = currentTranslate - prevTranslate;
    if (moved < -60) carouselNext();
    else if (moved > 60) carouselPrev();
    else goToPage(currentPage);
  }

  track.addEventListener('mousedown', dragStart);
  track.addEventListener('mousemove', dragMove);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('mouseleave', dragEnd);
  track.addEventListener('touchstart', dragStart, { passive: true });
  track.addEventListener('touchmove', dragMove, { passive: true });
  track.addEventListener('touchend', dragEnd);

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') carouselPrev();
    if (e.key === 'ArrowRight') carouselNext();
  });

  window.addEventListener('resize', function() {
    var newCPP = getCardsPerPage();
    if (newCPP !== cardsPerPage) { cardsPerPage = newCPP; goToPage(0); }
  });

  function updateStats() {
    var laki = siswaData.filter(function(s) { return s.gender === 'L'; }).length;
    var perempuan = siswaData.filter(function(s) { return s.gender === 'P'; }).length;
    var totalEl = document.getElementById('totalCount');
    var lakiEl = document.getElementById('lakiCount');
    var perempuanEl = document.getElementById('perempuanCount');
    if (totalEl) totalEl.textContent = siswaData.length;
    if (lakiEl) lakiEl.textContent = laki;
    if (perempuanEl) perempuanEl.textContent = perempuan;
  }

  cardsPerPage = getCardsPerPage();
  updateStats();
  renderCards();
  requestAnimationFrame(function() { goToPage(0); });
})();


/* ================================================
   ALBUM — hanya jalan kalau elemen ada
   ================================================ */
(function() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var albumPhotos = {
    'first-code': [
      'img/album/first-code/foto (1).jpeg',
      'img/album/first-code/foto (2).jpeg',
      'img/album/first-code/foto (3).jpeg',
      'img/album/first-code/foto (4).jpeg',
      'img/album/first-code/foto (5).jpeg',
      'img/album/first-code/foto (6).jpeg',
      'img/album/first-code/foto (7).jpeg',
      'img/album/first-code/foto (8).jpeg',
      'img/album/first-code/foto (9).jpeg',
      'img/album/first-code/foto (10).jpeg',
      'img/album/first-code/foto (11).jpeg'
    ],
    'lab-life': [
      'img/album/lab-life/foto (1).jpeg',
      'img/album/lab-life/foto (2).jpeg',
      'img/album/lab-life/foto (3).jpeg',
      'img/album/lab-life/foto (4).jpeg',
      'img/album/lab-life/foto (5).jpeg',
      'img/album/lab-life/foto (6).jpeg',
      'img/album/lab-life/foto (7).jpeg',
      'img/album/lab-life/foto (8).jpeg',
      'img/album/lab-life/foto (9).jpeg',
      'img/album/lab-life/foto (10).jpeg',
      'img/album/lab-life/foto (11).jpeg',
      'img/album/lab-life/foto (12).jpeg',
      'img/album/lab-life/foto (13).jpeg',
      'img/album/lab-life/foto (14).jpeg',
      'img/album/lab-life/foto (15).jpeg',
      'img/album/lab-life/foto (16).jpeg',
      'img/album/lab-life/foto (17).jpeg',
      'img/album/lab-life/foto (18).jpeg',
      'img/album/lab-life/foto (19).jpeg',
      'img/album/lab-life/foto (20).jpeg',
      'img/album/lab-life/foto (21).jpeg',
      'img/album/lab-life/foto (22).jpeg',
      'img/album/lab-life/foto (23).jpeg',
      'img/album/lab-life/foto (24).jpeg',
      'img/album/lab-life/foto (25).jpeg',
      'img/album/lab-life/foto (26).jpeg',
      'img/album/lab-life/foto (27).jpeg',
      'img/album/lab-life/foto (28).jpeg',
      'img/album/lab-life/foto (29).jpeg',
      'img/album/lab-life/foto (30).jpeg',
      'img/album/lab-life/foto (31).jpeg',
      'img/album/lab-life/foto (32).jpeg',
      'img/album/lab-life/foto (33).jpeg',
      'img/album/lab-life/foto (34).jpeg',
      'img/album/lab-life/foto (35).jpeg',
      'img/album/lab-life/foto (36).jpeg',
      'img/album/lab-life/foto (37).jpeg',
      'img/album/lab-life/foto (38).jpeg',
      'img/album/lab-life/foto (39).jpeg',
      'img/album/lab-life/foto (40).jpeg',
      'img/album/lab-life/foto (41).jpeg',
      'img/album/lab-life/foto (42).jpeg',
      'img/album/lab-life/foto (43).jpeg',
      'img/album/lab-life/foto (44).jpeg',
      'img/album/lab-life/foto (45).jpeg',
      'img/album/lab-life/foto (46).jpeg',
      'img/album/lab-life/foto (47).jpeg',
      'img/album/lab-life/foto (48).jpeg',
      'img/album/lab-life/foto (49).jpeg',
      'img/album/lab-life/foto (50).jpeg',
      'img/album/lab-life/foto (51).jpeg',
      'img/album/lab-life/foto (52).jpeg',
      'img/album/lab-life/foto (53).jpeg',
      'img/album/lab-life/foto (54).jpeg',
      'img/album/lab-life/foto (55).jpeg',
      'img/album/lab-life/foto (56).jpeg',
      'img/album/lab-life/foto (57).jpeg',
      'img/album/lab-life/foto (58).jpeg',
      'img/album/lab-life/foto (59).jpeg',
      'img/album/lab-life/foto (60).jpeg',
      'img/album/lab-life/foto (61).jpeg',
      'img/album/lab-life/foto (62).jpeg',
      'img/album/lab-life/foto (63).jpeg',
      'img/album/lab-life/foto (64).jpeg',
      'img/album/lab-life/foto (65).jpeg',
      'img/album/lab-life/foto (66).jpeg',
      'img/album/lab-life/foto (67).jpeg',
      'img/album/lab-life/foto (68).jpeg',
      'img/album/lab-life/foto (69).jpeg',
      'img/album/lab-life/foto (70).jpeg',
      'img/album/lab-life/foto (71).jpeg',
      'img/album/lab-life/foto (72).jpeg',
      'img/album/lab-life/foto (73).jpeg',
      'img/album/lab-life/foto (74).jpeg',
      'img/album/lab-life/foto (75).jpeg',
      'img/album/lab-life/foto (76).jpeg',
      'img/album/lab-life/foto (77).jpeg',
      'img/album/lab-life/foto (78).jpeg',
      'img/album/lab-life/foto (79).jpeg',
      'img/album/lab-life/foto (80).jpeg',
      'img/album/lab-life/foto (81).jpeg',
      'img/album/lab-life/foto (82).jpeg',
      'img/album/lab-life/foto (83).jpeg',
      'img/album/lab-life/foto (84).jpeg',
      'img/album/lab-life/foto (85).jpeg',
      'img/album/lab-life/foto (86).jpeg',
      'img/album/lab-life/foto (87).jpeg',
      'img/album/lab-life/foto (88).jpeg',
      'img/album/lab-life/foto (89).jpeg',
      'img/album/lab-life/foto (90).jpeg',
      'img/album/lab-life/foto (91).jpeg',
      'img/album/lab-life/foto (92).jpeg',
      'img/album/lab-life/foto (93).jpeg',
      'img/album/lab-life/foto (94).jpeg',
      'img/album/lab-life/foto (95).jpeg',
      'img/album/lab-life/foto (96).jpeg',
      'img/album/lab-life/foto (97).jpeg',
      'img/album/lab-life/foto (98).jpeg',
      'img/album/lab-life/foto (99).jpeg',
      'img/album/lab-life/foto (100).jpeg'
    ],
    'beyond-classroom': [
      'img/album/beyond-classroom/foto (1).jpeg',
      'img/album/beyond-classroom/foto (2).jpeg',
      'img/album/beyond-classroom/foto (3).jpeg',
      'img/album/beyond-classroom/foto (4).jpeg',
      'img/album/beyond-classroom/foto (5).jpeg',
      'img/album/beyond-classroom/foto (6).jpeg',
      'img/album/beyond-classroom/foto (7).jpeg',
      'img/album/beyond-classroom/foto (8).jpeg',
      'img/album/beyond-classroom/foto (9).jpeg',
      'img/album/beyond-classroom/foto (10).jpeg',
      'img/album/beyond-classroom/foto (11).jpeg',
      'img/album/beyond-classroom/foto (12).jpeg',
      'img/album/beyond-classroom/foto (13).jpeg',
      'img/album/beyond-classroom/foto (14).jpeg',
      'img/album/beyond-classroom/foto (15).jpeg',
      'img/album/beyond-classroom/foto (16).jpeg',
      'img/album/beyond-classroom/foto (17).jpeg',
      'img/album/beyond-classroom/foto (18).jpeg',
      'img/album/beyond-classroom/foto (19).jpeg',
      'img/album/beyond-classroom/foto (20).jpeg',
      'img/album/beyond-classroom/foto (21).jpeg'
    ],
    'wild-free': [
      'img/album/wild-free/foto (1).jpeg',
      'img/album/wild-free/foto (2).jpeg',
      'img/album/wild-free/foto (3).jpeg',
      'img/album/wild-free/foto (4).jpeg',
      'img/album/wild-free/foto (5).jpeg',
      'img/album/wild-free/foto (6).jpeg',
      'img/album/wild-free/foto (7).jpeg',
      'img/album/wild-free/foto (8).jpeg',
      'img/album/wild-free/foto (9).jpeg',
      'img/album/wild-free/foto (10).jpeg',
      'img/album/wild-free/foto (11).jpeg',
      'img/album/wild-free/foto (12).jpeg',
      'img/album/wild-free/foto (13).jpeg',
      'img/album/wild-free/foto (14).jpeg',
      'img/album/wild-free/foto (15).jpeg',
      'img/album/wild-free/foto (16).jpeg',
      'img/album/wild-free/foto (17).jpeg',
      'img/album/wild-free/foto (18).jpeg',
      'img/album/wild-free/foto (19).jpeg',
      'img/album/wild-free/foto (20).jpeg',
      'img/album/wild-free/foto (21).jpeg',
      'img/album/wild-free/foto (22).jpeg',
      'img/album/wild-free/foto (23).jpeg',
      'img/album/wild-free/foto (24).jpeg',
      'img/album/wild-free/foto (25).jpeg',
      'img/album/wild-free/foto (26).jpeg',
      'img/album/wild-free/foto (27).jpeg',
      'img/album/wild-free/foto (28).jpeg',
      'img/album/wild-free/foto (29).jpeg',
      'img/album/wild-free/foto (30).jpeg',
      'img/album/wild-free/foto (31).jpeg',
      'img/album/wild-free/foto (32).jpeg',
      'img/album/wild-free/foto (33).jpeg',
      'img/album/wild-free/foto (34).jpeg',
      'img/album/wild-free/foto (35).jpeg',
      'img/album/wild-free/foto (36).jpeg',
      'img/album/wild-free/foto (37).jpeg',
      'img/album/wild-free/foto (38).jpeg',
      'img/album/wild-free/foto (39).jpeg',
      'img/album/wild-free/foto (40).jpeg',
      'img/album/wild-free/foto (41).jpeg',
      'img/album/wild-free/foto (42).jpeg',
      'img/album/wild-free/foto (43).jpeg',
      'img/album/wild-free/foto (44).jpeg',
      'img/album/wild-free/foto (45).jpeg',
      'img/album/wild-free/foto (46).jpeg',
      'img/album/wild-free/foto (47).jpeg',
      'img/album/wild-free/foto (48).jpeg',
      'img/album/wild-free/foto (49).jpeg',
      'img/album/wild-free/foto (50).jpeg',
      'img/album/wild-free/foto (51).jpeg',
      'img/album/wild-free/foto (52).jpeg',
      'img/album/wild-free/foto (53).jpeg',
      'img/album/wild-free/foto (54).jpeg',
      'img/album/wild-free/foto (55).jpeg',
      'img/album/wild-free/foto (56).jpeg',
      'img/album/wild-free/foto (57).jpeg',
      'img/album/wild-free/foto (58).jpeg'
    ],
    'together-forever': [
      'img/album/together-forever/foto (1).jpeg',
      'img/album/together-forever/foto (2).jpeg',
      'img/album/together-forever/foto (3).jpeg',
      'img/album/together-forever/foto (4).jpeg',
      'img/album/together-forever/foto (5).jpeg',
      'img/album/together-forever/foto (6).jpeg',
      'img/album/together-forever/foto (7).jpeg',
      'img/album/together-forever/foto (8).jpeg',
      'img/album/together-forever/foto (9).jpeg',
      'img/album/together-forever/foto (10).jpeg',
      'img/album/together-forever/foto (11).jpeg',
      'img/album/together-forever/foto (12).jpeg',
      'img/album/together-forever/foto (13).jpeg',
      'img/album/together-forever/foto (14).jpeg',
      'img/album/together-forever/foto (15).jpeg',
      'img/album/together-forever/foto (16).jpeg',
      'img/album/together-forever/foto (17).jpeg',
      'img/album/together-forever/foto (18).jpeg',
      'img/album/together-forever/foto (19).jpeg',
      'img/album/together-forever/foto (20).jpeg',
      'img/album/together-forever/foto (21).jpeg',
      'img/album/together-forever/foto (22).jpeg',
      'img/album/together-forever/foto (23).jpeg',
      'img/album/together-forever/foto (24).jpeg',
      'img/album/together-forever/foto (25).jpeg',
      'img/album/together-forever/foto (26).jpeg',
      'img/album/together-forever/foto (27).jpeg',
      'img/album/together-forever/foto (28).jpeg',
      'img/album/together-forever/foto (29).jpeg',
      'img/album/together-forever/foto (30).jpeg',
      'img/album/together-forever/foto (31).jpeg',
      'img/album/together-forever/foto (32).jpeg',
      'img/album/together-forever/foto (33).jpeg',
      'img/album/together-forever/foto (34).jpeg',
      'img/album/together-forever/foto (35).jpeg',
      'img/album/together-forever/foto (36).jpeg',
      'img/album/together-forever/foto (37).jpeg',
      'img/album/together-forever/foto (38).jpeg',
      'img/album/together-forever/foto (39).jpeg',
      'img/album/together-forever/foto (40).jpeg',
      'img/album/together-forever/foto (41).jpeg',
      'img/album/together-forever/foto (42).jpeg',
      'img/album/together-forever/foto (43).jpeg',
      'img/album/together-forever/foto (44).jpeg',
      'img/album/together-forever/foto (45).jpeg',
      'img/album/together-forever/foto (46).jpeg',
      'img/album/together-forever/foto (47).jpeg',
      'img/album/together-forever/foto (48).jpeg',
      'img/album/together-forever/foto (49).jpeg',
      'img/album/together-forever/foto (50).jpeg',
      'img/album/together-forever/foto (51).jpeg',
      'img/album/together-forever/foto (52).jpeg',
      'img/album/together-forever/foto (53).jpeg',
      'img/album/together-forever/foto (54).jpeg',
      'img/album/together-forever/foto (55).jpeg',
      'img/album/together-forever/foto (56).jpeg',
      'img/album/together-forever/foto (57).jpeg',
      'img/album/together-forever/foto (58).jpeg',
      'img/album/together-forever/foto (59).jpeg',
      'img/album/together-forever/foto (60).jpeg',
      'img/album/together-forever/foto (61).jpeg',
      'img/album/together-forever/foto (62).jpeg',
      'img/album/together-forever/foto (63).jpeg',
      'img/album/together-forever/foto (64).jpeg',
      'img/album/together-forever/foto (65).jpeg',
      'img/album/together-forever/foto (66).jpeg',
      'img/album/together-forever/foto (67).jpeg',
      'img/album/together-forever/foto (68).jpeg',
      'img/album/together-forever/foto (69).jpeg',
      'img/album/together-forever/foto (70).jpeg',
      'img/album/together-forever/foto (71).jpeg',
      'img/album/together-forever/foto (72).jpeg',
      'img/album/together-forever/foto (73).jpeg',
      'img/album/together-forever/foto (74).jpeg',
      'img/album/together-forever/foto (75).jpeg',
      'img/album/together-forever/foto (76).jpeg',
      'img/album/together-forever/foto (77).jpeg',
      'img/album/together-forever/foto (78).jpeg',
      'img/album/together-forever/foto (79).jpeg',
      'img/album/together-forever/foto (80).jpeg',
      'img/album/together-forever/foto (81).jpeg',
      'img/album/together-forever/foto (82).jpeg',
      'img/album/together-forever/foto (83).jpeg',
      'img/album/together-forever/foto (84).jpeg',
      'img/album/together-forever/foto (85).jpeg',
      'img/album/together-forever/foto (86).jpeg',
      'img/album/together-forever/foto (87).jpeg',
      'img/album/together-forever/foto (88).jpeg',
      'img/album/together-forever/foto (89).jpeg',
      'img/album/together-forever/foto (90).jpeg',
      'img/album/together-forever/foto (91).jpeg',
      'img/album/together-forever/foto (92).jpeg',
      'img/album/together-forever/foto (93).jpeg',
      'img/album/together-forever/foto (94).jpeg',
      'img/album/together-forever/foto (95).jpeg',
      'img/album/together-forever/foto (96).jpeg',
      'img/album/together-forever/foto (97).jpeg',
      'img/album/together-forever/foto (98).jpeg',
      'img/album/together-forever/foto (99).jpeg',
      'img/album/together-forever/foto (100).jpeg',
      'img/album/together-forever/foto (101).jpeg',
      'img/album/together-forever/foto (102).jpeg',
      'img/album/together-forever/foto (103).jpeg',
      'img/album/together-forever/foto (104).jpeg',
      'img/album/together-forever/foto (105).jpeg',
      'img/album/together-forever/foto (106).jpeg',
      'img/album/together-forever/foto (107).jpeg',
      'img/album/together-forever/foto (108).jpeg',
      'img/album/together-forever/foto (109).jpeg',
      'img/album/together-forever/foto (110).jpeg',
      'img/album/together-forever/foto (111).jpeg',
      'img/album/together-forever/foto (112).jpeg',
      'img/album/together-forever/foto (113).jpeg',
      'img/album/together-forever/foto (114).jpeg',
      'img/album/together-forever/foto (115).jpeg',
      'img/album/together-forever/foto (116).jpeg',
      'img/album/together-forever/foto (117).jpeg',
      'img/album/together-forever/foto (118).jpeg',
      'img/album/together-forever/foto (119).jpeg',
      'img/album/together-forever/foto (120).jpeg',
      'img/album/together-forever/foto (121).jpeg',
      'img/album/together-forever/foto (122).jpeg',
      'img/album/together-forever/foto (123).jpeg',
      'img/album/together-forever/foto (124).jpeg',
      'img/album/together-forever/foto (125).jpeg',
      'img/album/together-forever/foto (126).jpeg',
      'img/album/together-forever/foto (127).jpeg',
      'img/album/together-forever/foto (128).jpeg'
    ]
  };

  var allItems = [];
  var lbIndex = 0;
  var lbSwipeStartX = 0;
  var lbSwiping = false;
  var lbLoading = false;
  var imageCache = {};

  var lbImg = document.getElementById('lbImg');
  var lbEmpty = document.getElementById('lbEmpty');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbCounter = document.getElementById('lbCounter');
  var lbDownload = document.getElementById('lbDownload');

  function initAlbumCounts() {
    var cards = document.querySelectorAll('.album-card');
    cards.forEach(function(card) {
      var folder = card.getAttribute('data-folder');
      var paths = albumPhotos[folder] || [];
      var countSpan = card.querySelector('.album-count span');
      if (countSpan) countSpan.textContent = paths.length + ' foto';
    });
  }
  initAlbumCounts();

  window.openAlbum = function(cardEl) {
    var folder = cardEl.getAttribute('data-folder');
    var paths = albumPhotos[folder] || [];
    allItems = [];
    paths.forEach(function(src) {
      allItems.push({ src: src, alt: folder });
    });
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    finalizeOpen();
  };

  function finalizeOpen() {
    if (allItems.length === 0) {
      showEmpty();
    } else {
      lbIndex = 0;
      showPhoto();
    }
  }

  function showPhoto() {
    if (lbLoading) return;
    var item = allItems[lbIndex];
    if (imageCache[item.src]) {
      applyPhoto(item);
      return;
    }
    lbLoading = true;
    var img = new Image();
    img.onload = function() {
      imageCache[item.src] = true;
      applyPhoto(item);
      lbLoading = false;
    };
    img.onerror = function() {
      lbLoading = false;
      if (allItems.length <= 1) {
        showEmpty();
      } else if (lbIndex >= allItems.length - 1) {
        lbIndex--;
        showPhoto();
      } else {
        lbIndex++;
        showPhoto();
      }
    };
    img.src = item.src;
  }

  function applyPhoto(item) {
    if (lbImg) lbImg.style.display = 'block';
    if (lbEmpty) lbEmpty.style.display = 'none';
    if (lbPrev) lbPrev.style.display = '';
    if (lbNext) lbNext.style.display = '';
    if (lbDownload) lbDownload.style.display = '';
    lbImg.classList.add('switching');
    setTimeout(function() {
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbImg.classList.remove('switching');
    }, 150);
    if (lbPrev) lbPrev.disabled = lbIndex === 0;
    if (lbNext) lbNext.disabled = lbIndex === allItems.length - 1;
    if (lbCounter) lbCounter.textContent = (lbIndex + 1) + ' / ' + allItems.length;
  }

  function showEmpty() {
    if (lbImg) lbImg.style.display = 'none';
    if (lbEmpty) lbEmpty.style.display = 'block';
    if (lbPrev) lbPrev.style.display = 'none';
    if (lbNext) lbNext.style.display = 'none';
    if (lbCounter) lbCounter.textContent = '';
    if (lbDownload) lbDownload.style.display = 'none';
  }

  window.closeLightbox = function() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lbNav = function(dir) {
    if (lbLoading) return;
    var next = lbIndex + dir;
    if (next < 0 || next >= allItems.length) return;
    lbIndex = next;
    showPhoto();
  };

  window.lbDownload = function() {
    if (allItems.length === 0) return;
    var a = document.createElement('a');
    a.href = allItems[lbIndex].src;
    a.download = allItems[lbIndex].alt || 'foto-rpl1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  lightbox.addEventListener('touchstart', function(e) {
    lbSwipeStartX = e.changedTouches[0].screenX;
    lbSwiping = true;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    if (!lbSwiping) return;
    lbSwiping = false;
    var diff = e.changedTouches[0].screenX - lbSwipeStartX;
    if (diff < -50) lbNav(1);
    else if (diff > 50) lbNav(-1);
  }, { passive: true });
})();