import initTiltEffect from "./scripts/tiltAnimation";

// ── Dynamic footer year ─────────────────────────────────────────
document.getElementById("footer-year").textContent = new Date().getFullYear();

// ── Navbar scroll behaviour ─────────────────────────────────────
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
});

// ── tsParticles ─────────────────────────────────────────────────
window.addEventListener("load", () => {
  if (window.tsParticles) {
    tsParticles.load("particles-js", {
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true, area: 900 } },
        color: { value: ["#6c63ff", "#00f5d4"] },
        links: {
          enable: true,
          color: "#6c63ff",
          opacity: 0.12,
          distance: 140,
          width: 1,
        },
        move: { enable: true, speed: 0.6, outModes: { default: "bounce" } },
        opacity: { value: 0.35 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.35 } },
          push: { quantity: 3 },
        },
      },
      detectRetina: true,
    });
  }

  if (window.Typed) {
    new Typed("#typed-output", {
      strings: [
        "Full-Stack Web Developer.",
        "React & TypeScript Engineer.",
        "Android + ML Builder.",
        "Open Source Enthusiast.",
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      smartBackspace: true,
    });
  }
});

// ── Skill IntersectionObserver ──────────────────────────────────
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-tag").forEach((tag, i) => {
          setTimeout(() => tag.classList.add("visible"), i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
document
  .querySelectorAll(".skill-category")
  .forEach((el) => skillObserver.observe(el));

// ── Tilt ────────────────────────────────────────────────────────
if (!("ontouchstart" in window)) initTiltEffect();

// ── Smooth nav scroll ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── Bento grid auto full-width ──────────────────────────────────
(function autoFullWidth() {
  const grid = document.querySelector(".bento-grid");
  if (!grid) return;
  const cards = [...grid.children].filter(
    (c) => !c.classList.contains("featured")
  );
  if (cards.length % 2 !== 0) {
    const last = cards[cards.length - 1];
    last.style.gridColumn = "1 / -1";
    last.querySelector(".project-card__image").style.height = "32rem";
  }
})();

// ── Orbit dot animation ─────────────────────────────────────────
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    if (!window.gsap) return;
    function runOrbit(id, rx, ry, duration, startT, rotateDeg) {
      const rad = (rotateDeg * Math.PI) / 180;
      const cosR = Math.cos(rad),
        sinR = Math.sin(rad);
      const state = { t: startT };
      gsap.to(state, {
        t: startT + Math.PI * 2,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate() {
          const ex = rx * Math.cos(state.t),
            ey = ry * Math.sin(state.t);
          const fx = 200 + ex * cosR - ey * sinR,
            fy = 200 + ex * sinR + ey * cosR;
          document.getElementById(id).setAttribute("cx", fx);
          document.getElementById(id).setAttribute("cy", fy);
        },
      });
    }
    const DURATION = 10,
      GAP = (Math.PI * 2) / 5;
    for (let i = 0; i < 5; i++)
      runOrbit(`dot${i + 1}`, 160, 45, DURATION, GAP * i, 0);
    for (let i = 0; i < 5; i++)
      runOrbit(`dot${i + 6}`, 45, 150, DURATION, GAP * i, -22);
    for (let i = 0; i < 5; i++)
      runOrbit(`dot${i + 11}`, 45, 160, DURATION, GAP * i, 45);
  });
});

// ════════════════════════════════════════════════════════════════
// ISEKAI WORLD
// ════════════════════════════════════════════════════════════════
const ISEKAI_PASSWORD = "isekai is my favourite genere";
const DATA_URL =
  "https://raw.githubusercontent.com/PintooMali/react-test/main/data.json";
const FAV_KEY = "isekai_favs";

const isekaiBtn = document.getElementById("isekai-btn");
const isekaiModal = document.getElementById("isekai-modal");
const isekaiPage = document.getElementById("isekai-page");
const isekaiClose = document.getElementById("isekai-close");
const isekaiSubmit = document.getElementById("isekai-submit");
const isekaiInput = document.getElementById("isekai-password");
const isekaiError = document.getElementById("isekai-error");
const detailPage = document.getElementById("anime-detail");
const detailBack = document.getElementById("detail-back");
const detailTitle = document.getElementById("detail-title");
const detailHero = document.getElementById("detail-hero");
const detailMeta = document.getElementById("detail-meta");
const detailGallery = document.getElementById("detail-gallery");

let animeData = [];
let carouselTimer = null;
let activeGenre = null;
let favOnly = false;
let posterView = false; // false = grid, true = poster wall

// ── Favorites (localStorage) ─────────────────────────────────────
const getFavs = () => JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
const toggleFav = (title) => {
  const favs = getFavs();
  const idx = favs.indexOf(title);
  idx === -1 ? favs.push(title) : favs.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
};
const isFav = (title) => getFavs().includes(title);

// ── Modal ────────────────────────────────────────────────────────
isekaiBtn.addEventListener("click", () => isekaiModal.classList.add("active"));
isekaiModal.addEventListener("click", (e) => {
  if (e.target === isekaiModal) closeModal();
});

function closeModal() {
  isekaiModal.classList.remove("active");
  isekaiInput.value = "";
  isekaiError.textContent = "";
}

isekaiSubmit.addEventListener("click", checkPassword);
isekaiInput.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && checkPassword()
);

function checkPassword() {
  if (isekaiInput.value.trim() === ISEKAI_PASSWORD) {
    closeModal();
    openIsekaiPage();
  } else {
    isekaiError.textContent = "Wrong passphrase. Try again.";
    isekaiInput.classList.add("shake");
    setTimeout(() => isekaiInput.classList.remove("shake"), 500);
  }
}

// ── Isekai Page ──────────────────────────────────────────────────
async function openIsekaiPage() {
  isekaiPage.classList.add("open");
  document.body.style.overflow = "hidden";

  const grid = document.getElementById("isekai-grid");
  const track = document.getElementById("carousel-track");
  const dots = document.getElementById("carousel-dots");

  if (grid.dataset.loaded) return;
  grid.dataset.loaded = "true";
  grid.innerHTML = `<div class="isekai-loading">Loading your anime world... 🌸</div>`;

  try {
    const res = await fetch(DATA_URL);
    animeData = await res.json();

    // ── Carousel (max 10) ──────────────────────────────────────
    const featured = animeData.filter((a) => a.cover).slice(0, 10);
    track.innerHTML = featured
      .map(
        (a, i) => `
      <div class="carousel-slide" data-index="${i}" style="cursor:pointer">
        <img src="${a.cover}" alt="${a.title}" loading="lazy" />
        <div class="slide-overlay"></div>
        <div class="slide-info">
          <h2>${a.title}</h2>
          <div class="slide-genre">${a.genres
            .map((g) => `<span>${g}</span>`)
            .join("")}</div>
        </div>
      </div>`
      )
      .join("");

    dots.innerHTML = featured
      .map(
        (_, i) =>
          `<span class="${i === 0 ? "active" : ""}" data-index="${i}"></span>`
      )
      .join("");

    track.querySelectorAll(".carousel-slide").forEach((slide) => {
      slide.addEventListener("click", () =>
        window.openDetailPage(featured[+slide.dataset.index])
      );
    });

    initCarousel(featured.length);

    // ── Spotlight (featured: true) ─────────────────────────────
    const spotlight = animeData.find((a) => a.featured);
    if (spotlight) renderSpotlight(spotlight);

    // ── Genre filter pills ─────────────────────────────────────
    const allGenres = [...new Set(animeData.flatMap((a) => a.genres))].sort();
    const gf = document.getElementById("genre-filters");
    gf.innerHTML = allGenres
      .map((g) => `<button class="genre-pill" data-genre="${g}">${g}</button>`)
      .join("");
    gf.addEventListener("click", (e) => {
      if (!e.target.classList.contains("genre-pill")) return;
      const g = e.target.dataset.genre;
      activeGenre = activeGenre === g ? null : g;
      gf.querySelectorAll(".genre-pill").forEach((p) =>
        p.classList.toggle("active", p.dataset.genre === activeGenre)
      );
      renderGrid();
      window._isekaiReady();
    });

    // ── Sort ───────────────────────────────────────────────────
    document
      .getElementById("anime-sort")
      .addEventListener("change", renderGrid);

    // ── Search ────────────────────────────────────────────────
    document
      .getElementById("anime-search")
      .addEventListener("input", renderGrid);

    // ── Favorites filter ──────────────────────────────────────
    document.getElementById("fav-filter").addEventListener("click", (e) => {
      favOnly = !favOnly;
      e.currentTarget.classList.toggle("active", favOnly);
      renderGrid();
    });

    // ── Random ────────────────────────────────────────────────
    document.getElementById("random-btn").addEventListener("click", () => {
      const pick = animeData[Math.floor(Math.random() * animeData.length)];
      window.openDetailPage(pick);
    });

    // ── View toggle ───────────────────────────────────────────
    document.getElementById("view-toggle").addEventListener("click", (e) => {
      posterView = !posterView;
      e.currentTarget.textContent = posterView ? "⊟" : "⊞";
      document
        .getElementById("isekai-grid")
        .classList.toggle("poster-wall", posterView);
    });

    renderGrid();
    window._isekaiReady();
  } catch {
    grid.innerHTML = `<div class="isekai-error">Failed to load. Check your repo. 😢</div>`;
  }
}

// ── Spotlight ────────────────────────────────────────────────────
function renderSpotlight(anime) {
  const el = document.getElementById("isekai-spotlight");
  el.innerHTML = `
    <div class="spotlight-inner" style="background-image:url('${anime.cover}')">
      <div class="spotlight-overlay"></div>
      <div class="spotlight-content">
        <span class="spotlight-label">✨ Anime of the Month</span>
        <h2>${anime.title}</h2>
        <div class="spotlight-genres">${anime.genres
          .map((g) => `<span>${g}</span>`)
          .join("")}</div>
        <p>${anime.description || ""}</p>
        <button class="spotlight-cta" data-title="${
          anime.title
        }">Explore →</button>
      </div>
    </div>`;
  el.querySelector(".spotlight-cta").addEventListener("click", () =>
    window.openDetailPage(anime)
  );
}

// ── Render Grid ──────────────────────────────────────────────────
function renderGrid() {
  const query = document
    .getElementById("anime-search")
    .value.toLowerCase()
    .trim();
  const sort = document.getElementById("anime-sort").value;
  const favs = getFavs();

  let list = [...animeData];

  if (query)
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.genres.some((g) => g.toLowerCase().includes(query))
    );
  if (activeGenre) list = list.filter((a) => a.genres.includes(activeGenre));
  if (favOnly) list = list.filter((a) => favs.includes(a.title));

  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") list.sort((a, b) => b.title.localeCompare(a.title));

  const count = document.getElementById("anime-count");
  if (count) count.textContent = `(${list.length})`;

  const grid = document.getElementById("isekai-grid");
  if (list.length === 0) {
    grid.innerHTML = `<div class="isekai-error">No anime found. 🌸</div>`;
    return;
  }

  grid.innerHTML = list
    .map((a) => {
      const fav = isFav(a.title);
      const origIdx = animeData.indexOf(a);
      const statusColor = {
        Watching: "#00f5d4",
        Completed: "#6c63ff",
        "On Hold": "#f5c518",
        Dropped: "#ff6b6b",
      };
      const statusBg = statusColor[a.status] || "rgba(108,99,255,0.4)";
      const progress =
        a.watched != null && a.total
          ? `<div class="ep-bar"><div class="ep-fill" style="width:${Math.round(
              (a.watched / a.total) * 100
            )}%"></div></div>
         <div class="ep-label">${a.watched} / ${a.total} eps</div>`
          : "";
      return `
      <div class="anime-card" data-index="${origIdx}">
        <div class="card-img-wrap">
          <img class="anime-card__cover" src="${
            a.cover || "https://placehold.co/200x300?text=No+Cover"
          }" alt="${a.title}" loading="lazy" />
          ${
            a.status
              ? `<span class="status-badge" style="background:${statusBg}">${a.status}</span>`
              : ""
          }
          <button class="fav-btn ${fav ? "active" : ""}" data-title="${
        a.title
      }" title="Favourite">❤</button>
        </div>
        <div class="anime-card__body">
          <h4>${a.title}</h4>
          <div class="anime-rating">${"★".repeat(
            Math.round(a.rating)
          )}${"☆".repeat(5 - Math.round(a.rating))} ${a.rating}</div>
          ${progress}
          <div class="anime-genres">${a.genres
            .map((g) => `<span>${g}</span>`)
            .join("")}</div>
        </div>
      </div>`;
    })
    .join("");

  // Card click → detail
  grid.querySelectorAll(".anime-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".fav-btn")) return;
      window.openDetailPage(animeData[+card.dataset.index]);
    });
  });

  // Fav button click
  grid.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFav(btn.dataset.title);
      btn.classList.toggle("active", isFav(btn.dataset.title));
      if (favOnly) renderGrid();
    });
  });
}

isekaiClose.addEventListener("click", () => {
  isekaiPage.classList.remove("open");
  document.body.style.overflow = "";
  if (carouselTimer) clearInterval(carouselTimer);
});

// ── Detail Page ──────────────────────────────────────────────────
function openDetailPage(anime) {
  detailTitle.textContent = anime.title;
  detailHero.style.backgroundImage = `url('${anime.cover}')`;

  const statusColor = {
    Watching: "#00f5d4",
    Completed: "#6c63ff",
    "On Hold": "#f5c518",
    Dropped: "#ff6b6b",
  };
  const statusBg = statusColor[anime.status] || null;
  const progress =
    anime.watched != null && anime.total
      ? `<div class="detail-progress">
         <div class="ep-bar large"><div class="ep-fill" style="width:${Math.round(
           (anime.watched / anime.total) * 100
         )}%"></div></div>
         <span>${anime.watched} / ${anime.total} episodes watched</span>
       </div>`
      : "";

  detailMeta.innerHTML = `
    <div class="detail-top-row">
      <div class="detail-rating">${"★".repeat(
        Math.round(anime.rating)
      )}${"☆".repeat(5 - Math.round(anime.rating))} <span>${
    anime.rating
  }</span></div>
      ${
        anime.status
          ? `<span class="detail-status-badge" style="background:${statusBg}">${anime.status}</span>`
          : ""
      }
      <button class="detail-fav-btn ${
        isFav(anime.title) ? "active" : ""
      }" data-title="${anime.title}">❤ ${
    isFav(anime.title) ? "Favourited" : "Favourite"
  }</button>
    </div>
    <div class="detail-genres">${anime.genres
      .map((g) => `<span>${g}</span>`)
      .join("")}</div>
    ${progress}
    ${
      anime.description ? `<p class="detail-desc">${anime.description}</p>` : ""
    }
    ${
      anime.myReview
        ? `<blockquote class="my-review"><span>My Take</span>${anime.myReview}</blockquote>`
        : ""
    }
  `;

  detailMeta.querySelector(".detail-fav-btn").addEventListener("click", (e) => {
    toggleFav(anime.title);
    const active = isFav(anime.title);
    e.currentTarget.classList.toggle("active", active);
    e.currentTarget.textContent = `❤ ${active ? "Favourited" : "Favourite"}`;
    renderGrid();
  });

  const images = anime.images || [];
  if (images.length > 0) {
    detailGallery.innerHTML = `
      <h3 class="gallery-heading">Gallery</h3>
      <div class="masonry-grid">
        ${images
          .map(
            (src, i) => `
          <div class="masonry-item ${
            i % 5 === 0 ? "tall" : i % 3 === 0 ? "wide" : ""
          }" data-index="${i}">
            <img src="${src}" alt="${anime.title} ${i + 1}" loading="lazy" />
          </div>`
          )
          .join("")}
      </div>`;
    detailGallery.querySelectorAll(".masonry-item").forEach((item) => {
      item.addEventListener("click", () =>
        openLightbox(images, +item.dataset.index)
      );
    });
  } else {
    detailGallery.innerHTML = `<p class="isekai-error">No gallery images yet.</p>`;
  }

  detailPage.classList.add("open");
}

detailBack.addEventListener("click", () => detailPage.classList.remove("open"));

// ── Carousel ─────────────────────────────────────────────────────
function initCarousel(total) {
  if (total === 0) return;
  let current = 0;
  const track = document.getElementById("carousel-track");
  const dotEls = () => document.querySelectorAll("#carousel-dots span");

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotEls().forEach((d, i) => d.classList.toggle("active", i === current));
  }

  document.getElementById("carousel-dots").addEventListener("click", (e) => {
    if (e.target.dataset.index !== undefined) goTo(+e.target.dataset.index);
  });

  carouselTimer = setInterval(() => goTo(current + 1), 4000);
}

// ── Lightbox ─────────────────────────────────────────────────────
const lightbox = document.getElementById("img-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxCount = document.getElementById("lightbox-counter");

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
  lightboxImages = images;
  setLightboxImage(index);
  lightbox.classList.add("active");
  document.getElementById("anime-detail").style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.getElementById("anime-detail").style.overflow = "auto";
}

function setLightboxImage(index) {
  lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
  lightboxImg.style.opacity = "0";
  setTimeout(() => {
    lightboxImg.src = lightboxImages[lightboxIndex];
    lightboxImg.style.opacity = "1";
  }, 150);
  lightboxCount.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () =>
  setLightboxImage(lightboxIndex - 1)
);
lightboxNext.addEventListener("click", () =>
  setLightboxImage(lightboxIndex + 1)
);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox || e.target === lightboxImg.parentElement)
    closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "ArrowRight") setLightboxImage(lightboxIndex + 1);
  if (e.key === "ArrowLeft") setLightboxImage(lightboxIndex - 1);
  if (e.key === "Escape") closeLightbox();
});

// ════════════════════════════════════════════════════════════════
// TIER 1 — VISUAL SPECTACLES
// ════════════════════════════════════════════════════════════════

// ── 1. Sakura petal rain ─────────────────────────────────────────
function startSakura() {
  const container = document.getElementById("sakura-container");
  if (!container || container.dataset.running) return;
  container.dataset.running = "true";

  function spawnPetal() {
    const p = document.createElement("div");
    p.className = "sakura-petal";
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      animation-duration: ${4 + Math.random() * 5}s;
      animation-delay: ${Math.random() * 3}s;
      width: ${8 + Math.random() * 10}px;
      height: ${8 + Math.random() * 10}px;
      opacity: ${0.5 + Math.random() * 0.5};
    `;
    container.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }

  const interval = setInterval(spawnPetal, 180);
  setTimeout(() => {
    clearInterval(interval);
    delete container.dataset.running;
  }, 8000);
}

// ── 2. Ambient color extraction ──────────────────────────────────
function applyAmbientColor(imgSrc) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    canvas.width = 10;
    canvas.height = 10;
    ctx.drawImage(img, 0, 0, 10, 10);
    const d = ctx.getImageData(0, 0, 10, 10).data;
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < d.length; i += 4) {
      r += d[i];
      g += d[i + 1];
      b += d[i + 2];
    }
    const px = d.length / 4;
    r = Math.round(r / px);
    g = Math.round(g / px);
    b = Math.round(b / px);
    const detail = document.getElementById("anime-detail");
    detail.style.setProperty("--ambient-r", r);
    detail.style.setProperty("--ambient-g", g);
    detail.style.setProperty("--ambient-b", b);
    detail.classList.add("ambient-active");
  };
  img.onerror = () => {};
  img.src = imgSrc;
}

// ── 3. Glitch title effect ────────────────────────────────────────
function applyGlitch(el) {
  el.classList.remove("glitch");
  void el.offsetWidth; // reflow to restart animation
  el.classList.add("glitch");
  el.setAttribute("data-text", el.textContent);
}

// ── 4. Card stagger reveal ────────────────────────────────────────
function staggerCards() {
  document.querySelectorAll(".anime-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, i * 60);
  });
}

// ── 5. 3D card tilt ───────────────────────────────────────────────
function initAnimeTilt() {
  document.querySelectorAll(".anime-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -18;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ── 6. Parallax detail hero ───────────────────────────────────────
function initParallax() {
  const hero = document.getElementById("detail-hero");
  const detail = document.getElementById("anime-detail");
  detail.addEventListener("scroll", () => {
    const offset = detail.scrollTop * 0.4;
    hero.style.backgroundPositionY = `calc(center + ${offset}px)`;
  });
}
initParallax();

// ── 7. Cinematic letterbox carousel ──────────────────────────────
// Applied via CSS — letterbox bars are pseudo-elements on .isekai-carousel

// ── 8. Now Watching bar ───────────────────────────────────────────
function renderNowWatching() {
  const watching = animeData.find((a) => a.status === "Watching");
  const bar = document.getElementById("now-watching-bar");
  if (!watching) {
    bar.classList.remove("visible");
    return;
  }
  document.getElementById("nw-title").textContent = watching.title;
  bar.classList.add("visible");
  bar.onclick = () => window.openDetailPage(watching);
}

// ── 9. Anime quote of the day ─────────────────────────────────────
function renderQuoteOfDay() {
  const withQuotes = animeData.filter((a) => a.quotes && a.quotes.length);
  if (!withQuotes.length) return;
  const seed = new Date().toDateString();
  const idx =
    [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0) % withQuotes.length;
  const anime = withQuotes[idx];
  const quote = anime.quotes[Math.floor(Math.random() * anime.quotes.length)];
  document.getElementById("quote-text").textContent = `"${quote}"`;
  document.getElementById("quote-anime").textContent = `— ${anime.title}`;
  setTimeout(
    () => document.getElementById("quote-banner").classList.add("visible"),
    1200
  );
  const closeBtn = document.getElementById("quote-close");
  closeBtn.onclick = () =>
    document.getElementById("quote-banner").classList.remove("visible");
}

// ── 10. Completion confetti ───────────────────────────────────────
function fireConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = "block";

  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: 4 + Math.random() * 6,
    d: 2 + Math.random() * 3,
    color: ["#6c63ff", "#00f5d4", "#f5c518", "#ff6b6b", "#8b7cf8"][
      Math.floor(Math.random() * 5)
    ],
    tilt: Math.random() * 10 - 5,
    tiltAngle: 0,
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.tiltAngle += 0.05;
      p.y += p.d;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      ctx.beginPath();
      ctx.arc(p.x + p.tilt, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    if (pieces.some((p) => p.y < canvas.height)) {
      frame = requestAnimationFrame(draw);
    } else {
      canvas.style.display = "none";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
  setTimeout(() => {
    cancelAnimationFrame(frame);
    canvas.style.display = "none";
  }, 4000);
}

// ── 11. Konami code easter egg ────────────────────────────────────
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiIdx = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      if (document.getElementById("isekai-page").classList.contains("open")) {
        startSakura();
        fireConfetti();
      }
    }
  } else {
    konamiIdx = 0;
  }
});

// ── 12. Watch party / theater mode ───────────────────────────────
function initTheaterMode(anime) {
  const detail = document.getElementById("anime-detail");
  const existing = detail.querySelector(".theater-btn");
  if (existing) existing.remove();

  const btn = document.createElement("button");
  btn.className = "theater-btn";
  btn.textContent = "🎬 Theater Mode";
  btn.addEventListener("click", () => {
    const active = detail.classList.toggle("theater-mode");
    btn.textContent = active ? "✕ Exit Theater" : "🎬 Theater Mode";
    if (active) {
      const count = 1 + Math.floor(Math.random() * 12);
      btn.insertAdjacentHTML(
        "afterend",
        `<span class="theater-viewers">👥 ${count} watching with you</span>`
      );
    } else {
      detail.querySelector(".theater-viewers")?.remove();
    }
  });
  detail.querySelector(".detail-header").appendChild(btn);
}

// ── Wire everything into openIsekaiPage & openDetailPage ──────────
// Patch openIsekaiPage to call new features after data loads
const _origRenderGrid = renderGrid;
window._isekaiReady = function () {
  staggerCards();
  initAnimeTilt();
  renderNowWatching();
  renderQuoteOfDay();
  startSakura();
};

// Patch renderGrid to re-apply tilt + stagger after every filter
const origRenderGrid = renderGrid;
window.renderGrid = function () {
  origRenderGrid();
  staggerCards();
  initAnimeTilt();
};

// Patch openDetailPage to apply ambient color, glitch, theater mode
const origOpenDetailPage = openDetailPage;
window.openDetailPage = function (anime) {
  origOpenDetailPage(anime);
  if (anime.cover) applyAmbientColor(anime.cover);
  applyGlitch(document.getElementById("detail-title"));
  if (anime.status === "Completed") {
    setTimeout(fireConfetti, 300);
  }
  initTheaterMode(anime);
};
