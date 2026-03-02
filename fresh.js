
/* ==========================================
   FRESHLEARN SAFE INITIALIZATION
========================================== */

let scriptsInitialized = false;

function initAllFreshLearn() {

  if (scriptsInitialized) return; // prevent double init
  scriptsInitialized = true;

  initStatsObserver();
  animateFee();
  startCountdown();
  initBonusObserver();
  initModal();
  initLazySections();
  initSlideImages();
  initYoutubeLazy();
  initPopups();
}

/* ==========================================
   DELAY INIT (ANGULAR HYDRATION FIX)
========================================== */

window.addEventListener("load", function () {
  setTimeout(initAllFreshLearn, 800);
});


/* ==========================================
   COUNTERS
========================================== */

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = +counter.dataset.target;
    if (!target) return;

    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent =
        Math.floor(progress * target).toLocaleString("en-IN");

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

function initStatsObserver() {
  const section = document.getElementById("stats-section");
  if (!section || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.35 });

  observer.observe(section);
}


/* ==========================================
   FEE
========================================== */

function animateFee() {
  const el = document.getElementById("feeValue");
  if (!el) return;

  const start = +el.dataset.start;
  const end = +el.dataset.end;
  if (!start || !end) return;

  const duration = 1600;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start - (start - end) * progress);
    el.textContent = current.toLocaleString("en-IN");
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/* ==========================================
   COUNTDOWN
========================================== */

function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const endTime = Date.now() + 24 * 60 * 60 * 1000;

  function tick() {
    const diff = endTime - Date.now();
    if (diff <= 0) return el.textContent = "00:00:00";

    const h = String(Math.floor(diff / 3600000)).padStart(2,"0");
    const m = String(Math.floor((diff % 3600000)/60000)).padStart(2,"0");
    const s = String(Math.floor((diff % 60000)/1000)).padStart(2,"0");

    el.textContent = `${h}:${m}:${s}`;
    requestAnimationFrame(tick);
  }

  tick();
}


/* ==========================================
   POPUPS (GLOBAL SAFE)
========================================== */

let activePopup = null;
let exitPopupShown = false;
let scrollPopupShown = false;

function initPopups() {

  window.showPopup = function(id) {
    const el = document.getElementById(id);
    if (!el) return;

    if (activePopup && activePopup !== el) {
      activePopup.style.display = "none";
    }

    el.style.display = "flex";
    document.body.style.overflow = "hidden";
    activePopup = el;
  };

  window.closePopup = function(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.display = "none";
    document.body.style.overflow = "auto";
    activePopup = null;
  };

  document.addEventListener("mouseleave", function (e) {
    if (e.clientY <= 0 && !exitPopupShown && !activePopup) {
      exitPopupShown = true;
      showPopup("exitPopup");
    }
  });

  window.addEventListener("scroll", function () {
    if (scrollPopupShown || activePopup) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollPosition / docHeight > 0.7) {
      scrollPopupShown = true;
      showPopup("scrollPopup");
    }
  });
}


/* ==========================================
   BONUS
========================================== */

function initBonusObserver() {
  const section = document.getElementById("bonuses");
  if (!section || !("IntersectionObserver" in window)) return;

  const cards = section.querySelectorAll(".bonus-card");

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((card, i) =>
        setTimeout(() => card.classList.add("bonus-animate"), i * 150)
      );
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(section);
}


/* ==========================================
   MODAL
========================================== */

function initModal() {
  const modal = document.getElementById("certificateModal");
  const btn = document.getElementById("viewCertificateBtn");
  const closeBtn = document.querySelector(".certificate-close");
  if (!modal || !btn || !closeBtn) return;

  btn.addEventListener("click", () => {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  function close() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", e => e.target === modal && close());
}


/* ==========================================
   LAZY + YOUTUBE
========================================== */

function initLazySections() {
  const sections = document.querySelectorAll("main section:not(.hero)");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  });

  sections.forEach(section => observer.observe(section));
}

function initSlideImages() {
  const images = document.querySelectorAll(".slide-image");
  if (!images.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });

  images.forEach(img => observer.observe(img));
}

function initYoutubeLazy() {
  document.addEventListener("click", function (e) {
    const yt = e.target.closest(".youtube-lazy");
    if (!yt) return;

    yt.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${yt.dataset.id}?autoplay=1&rel=0"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    `;
  });
}
