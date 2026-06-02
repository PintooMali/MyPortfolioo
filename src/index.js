import initTiltEffect from "./scripts/tiltAnimation";

// ── Page load progress bar ──────────────────────────────────────
const progressBar = document.createElement("div");
progressBar.id = "progress-bar";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrolled =
    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + "%";
});

// ── Dynamic footer year ─────────────────────────────────────────
document.getElementById("footer-year").textContent = new Date().getFullYear();

// ── Custom cursor ───────────────────────────────────────────────
const dot = document.getElementById("cursor-dot");
const outline = document.getElementById("cursor-outline");
let mouseX = 0,
  mouseY = 0,
  outlineX = 0,
  outlineY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

(function animateOutline() {
  outlineX += (mouseX - outlineX) * 0.12;
  outlineY += (mouseY - outlineY) * 0.12;
  outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateOutline);
})();

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

// ── Lenis smooth scroll ─────────────────────────────────────────
window.addEventListener("load", () => {
  if (window.Lenis) {
    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
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

  // ── Typed.js ─────────────────────────────────────────────────
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

// ── GSAP scroll animations ──────────────────────────────────────
window.addEventListener("load", () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".section-title").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  });

  gsap.from(".about-wrapper__image", {
    scrollTrigger: { trigger: "#about", start: "top 75%" },
    x: -60,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".about-wrapper__info", {
    scrollTrigger: { trigger: "#about", start: "top 75%" },
    x: 60,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.out",
  });

  // Stats counter animation
  gsap.utils.toArray(".stat-number").forEach((el) => {
    const target = parseInt(el.getAttribute("data-target"));
    const obj = { val: 0 };
    gsap.to(obj, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      val: target,
      duration: 1.8,
      ease: "power2.out",
      onUpdate() {
        el.textContent = Math.ceil(obj.val) + "+";
      },
    });
  });

  gsap.utils.toArray(".skill-category").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      y: 50,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: "power3.out",
    });
  });

  gsap.utils.toArray(".project-card").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      y: 60,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power3.out",
    });
  });

  gsap.from(".contact-inner", {
    scrollTrigger: { trigger: "#contact", start: "top 75%" },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
  });
});

// ── Skill bar IntersectionObserver ──────────────────────────────
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

// ── Tilt (non-touch only) ───────────────────────────────────────
if (!("ontouchstart" in window)) initTiltEffect();

if (!("ontouchstart" in window)) {
  const dot = document.getElementById("cursor-dot");
  const outline = document.getElementById("cursor-outline");
  let mouseX = 0,
    mouseY = 0,
    outlineX = 0,
    outlineY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  (function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateOutline);
  })();
}

// ── Smooth nav link scroll ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── Respect reduced motion ──────────────────────────────────────
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document
    .querySelectorAll("[data-tilt]")
    .forEach((el) => el.removeAttribute("data-tilt"));
}

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

// ── Orbit dot animation using GSAP ─────────────────────────────
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    if (!window.gsap) return;

    const RAD45 = (45 * Math.PI) / 180;
    const cos45 = Math.cos(RAD45);
    const sin45 = Math.sin(RAD45);

    function runOrbit(id, rx, ry, duration, startT, rotateDeg) {
      const rad = (rotateDeg * Math.PI) / 180;
      const cosR = Math.cos(rad);
      const sinR = Math.sin(rad);
      const state = { t: startT };
      gsap.to(state, {
        t: startT + Math.PI * 2,
        duration,
        ease: "none",
        repeat: -1,
        onUpdate() {
          // raw ellipse point
          const ex = rx * Math.cos(state.t);
          const ey = ry * Math.sin(state.t);
          // apply rotation around center 200,200
          const fx = 200 + ex * cosR - ey * sinR;
          const fy = 200 + ex * sinR + ey * cosR;
          document.getElementById(id).setAttribute("cx", fx);
          document.getElementById(id).setAttribute("cy", fy);
        },
      });
    }

    const DURATION = 10;
    const GAP = (Math.PI * 2) / 5; // 72° apart — 5 evenly spaced dots

    // orbit-1: rx=160 ry=45
    runOrbit("dot1", 160, 45, DURATION, GAP * 0, 0);
    runOrbit("dot2", 160, 45, DURATION, GAP * 1, 0);
    runOrbit("dot3", 160, 45, DURATION, GAP * 2, 0);
    runOrbit("dot4", 160, 45, DURATION, GAP * 3, 0);
    runOrbit("dot5", 160, 45, DURATION, GAP * 4, 0);

    // orbit-2: rx=45 ry=150
    runOrbit("dot6", 45, 150, DURATION, GAP * 0, -22);
    runOrbit("dot7", 45, 150, DURATION, GAP * 1, -22);
    runOrbit("dot8", 45, 150, DURATION, GAP * 2, -22);
    runOrbit("dot9", 45, 150, DURATION, GAP * 3, -22);
    runOrbit("dot10", 45, 150, DURATION, GAP * 4, -22);

    // orbit-3: rx=45 ry=160
    runOrbit("dot11", 45, 160, DURATION, GAP * 0, 45);
    runOrbit("dot12", 45, 160, DURATION, GAP * 1, 45);
    runOrbit("dot13", 45, 160, DURATION, GAP * 2, 45);
    runOrbit("dot14", 45, 160, DURATION, GAP * 3, 45);
    runOrbit("dot15", 45, 160, DURATION, GAP * 4, 45);
  });
});
