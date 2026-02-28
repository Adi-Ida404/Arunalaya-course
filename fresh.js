// Number roll-up for stats, triggered on scroll into view
function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.floor(progress * target);
        counter.textContent = current.toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target.toLocaleString("en-IN");
    }

    requestAnimationFrame(update);
    });
}

function initStatsObserver() {
    const statsSection = document.getElementById("stats-section");
    if (!statsSection) return;

    if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            obs.unobserve(entry.target);
        }
        });
    }, { threshold: 0.35 });

    observer.observe(statsSection);
    } else {
    animateCounters();
    }
}

// Fee animation 150000 → 49000
function animateFee() {
    const feeElement = document.getElementById("feeValue");
    if (!feeElement) return;
    const start = parseInt(feeElement.dataset.start, 10);
    const end = parseInt(feeElement.dataset.end, 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start - (start - end) * progress);
    feeElement.textContent = current.toLocaleString("en-IN");
    if (progress < 1) requestAnimationFrame(update);
    else feeElement.textContent = end.toLocaleString("en-IN");
    }

    requestAnimationFrame(update);
}

// 24-hour countdown
function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;
    const endTime = Date.now() + 24 * 60 * 60 * 1000;

    function tick() {
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) {
        countdownEl.textContent = "00:00:00";
        return;
    }
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");
    countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
    requestAnimationFrame(tick);
    }

    tick();
}

// Popups
let exitPopupShown = false;
let scrollPopupShown = false;

function showPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "flex";
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

function initExitIntentPopup() {
    document.addEventListener("mouseleave", function (e) {
    if (e.clientY <= 0 && !exitPopupShown) {
        exitPopupShown = true;
        showPopup("exitPopup");
    }
    });
}

function initScrollPopup() {
    window.addEventListener("scroll", function () {
    if (scrollPopupShown) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (scrollPosition / docHeight > 0.7) {
        scrollPopupShown = true;
        showPopup("scrollPopup");
    }
    });
}

// Bonus animation on scroll
function initBonusObserver() {
    const bonusSection = document.getElementById("bonuses");
    if (!bonusSection || !("IntersectionObserver" in window)) return;

    const cards = bonusSection.querySelectorAll(".bonus-card");
    const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        cards.forEach((card, index) => {
            setTimeout(() => {
            card.classList.add("bonus-animate");
            }, index * 150);
        });
        obs.unobserve(entry.target);
        }
    });
    }, { threshold: 0.4 });

    observer.observe(bonusSection);
}

window.addEventListener("load", () => {
    initStatsObserver();
    animateFee();
    startCountdown();
    initExitIntentPopup();
    initScrollPopup();
    initBonusObserver();
});

document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("certificateModal");
  const btn = document.getElementById("viewCertificateBtn");
  const closeBtn = document.querySelector(".certificate-close");

  // Open modal
  btn.addEventListener("click", function () {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  // Close modal (X)
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close on outside click
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

});