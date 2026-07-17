// ===== Animated starfield =====
(function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(220, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.4 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.tw += 0.02;
      const alpha = 0.5 + Math.sin(s.tw) * 0.5;
      s.y += s.z * 0.15; // slow drift
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${alpha * s.z})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

// ===== Navbar scroll state =====
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });
}

// ===== Mobile menu =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  revealObserver.observe(el);
});

// ===== Animated counters =====
const counters = document.querySelectorAll(".num");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        cur += step;
        if (cur >= target) {
          el.textContent = target + "+";
        } else {
          el.textContent = cur;
          requestAnimationFrame(tick);
        }
      };
      tick();
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => counterObserver.observe(c));

// ===== Join form =====
const joinForm = document.getElementById("joinForm");
const formNote = document.getElementById("formNote");
joinForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("emailInput").value.trim();
  if (email) {
    formNote.textContent = `You're on the list, ${email.split("@")[0]}! Watch your inbox for new destinations and deals.`;
    joinForm.reset();
  }
});

// ===== Registration form =====
const registerForm = document.getElementById("registerForm");
const registerNote = document.getElementById("registerNote");

function setFieldError(input, message) {
  const field = input.closest(".field");
  if (!field) return;
  const errorEl = field.querySelector(".field-error");
  field.classList.toggle("invalid", Boolean(message));
  if (errorEl) errorEl.textContent = message || "";
}

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName");
  const email = document.getElementById("regEmail");
  const destination = document.getElementById("regDestination");
  const password = document.getElementById("regPassword");
  const confirm = document.getElementById("regConfirm");
  const terms = document.getElementById("regTerms");

  let valid = true;
  const fail = (input, msg) => { setFieldError(input, msg); valid = false; };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.value.trim().length < 2) fail(name, "Please enter your full name."); else setFieldError(name, "");
  if (!emailRe.test(email.value.trim())) fail(email, "Enter a valid email address."); else setFieldError(email, "");
  if (!destination.value) fail(destination, "Please select a destination."); else setFieldError(destination, "");
  if (password.value.length < 8) fail(password, "Password must be at least 8 characters."); else setFieldError(password, "");
  if (confirm.value !== password.value || !confirm.value) fail(confirm, "Passwords do not match."); else setFieldError(confirm, "");

  registerNote.style.color = "";
  if (!terms.checked) {
    valid = false;
    registerNote.style.color = "#ff6b6b";
    registerNote.textContent = "You must agree to the travel terms to continue.";
  }

  if (!valid) {
    if (terms.checked) registerNote.textContent = "";
    return;
  }

  registerNote.textContent = `Welcome aboard, ${name.value.trim().split(" ")[0]}! Your SkyCrew traveler account is ready.`;
  registerForm.reset();
  registerForm.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
});

// Clear a field's error as the user corrects it
registerForm?.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", () => setFieldError(el, ""));
});

// Show / hide password
document.querySelectorAll(".toggle-pw").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.classList.toggle("active", show);
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});
