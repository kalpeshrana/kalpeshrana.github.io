/* ==========================================================
   Kalpesh Rana — portfolio
   Edit CONFIG below. Everything else works without changes.
   ========================================================== */

const CONFIG = {
  // Where inquiries go (mailto fallback + every "Email" link on the page)
  email: "connect@cloudpixelinfotech.com",

  // Leave blank to hide the link. Full URLs, e.g. "https://www.linkedin.com/in/your-handle"
  linkedin: "",
  github: "",

  // WhatsApp number in international format, digits only, e.g. "919876543210". Blank hides it.
  whatsapp: "",

  // Optional: Formspree endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  // If set, the form posts there. If blank, the form opens the visitor's email app (mailto).
  formspree: "",

  // Real testimonials only. When this list has items, the "Client Feedback" section appears.
  // { quote: "…", name: "Full Name", role: "Role, Company" }
  testimonials: []
};

(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Contact links from CONFIG ---------- */
  $$("[data-email]").forEach((a) => {
    a.href = "mailto:" + CONFIG.email;
    if (a.hasAttribute("data-email-text")) a.textContent = CONFIG.email;
  });
  const links = {
    linkedin: CONFIG.linkedin,
    github: CONFIG.github,
    whatsapp: CONFIG.whatsapp ? "https://wa.me/" + CONFIG.whatsapp.replace(/\D/g, "") : ""
  };
  $$("[data-link]").forEach((li) => {
    const url = links[li.dataset.link];
    if (!url) return;
    $("a", li).href = url;
    li.hidden = false;
  });

  /* ---------- Nav: scroll state + mobile menu ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  const menu = $("#nav-links");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    // stagger siblings inside the same grid
    $$(".work-grid, .services, .pillars, .steps, .stack, .quotes").forEach((group) => {
      $$(".reveal", group).forEach((el, i) => el.style.setProperty("--d", (i % 3) * 0.08 + "s"));
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Card spotlight (cursor interaction) ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-spot]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });

    // Hero composition: gentle tilt
    const stage = $("#stage");
    if (stage) {
      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty("--ry", (x * 5).toFixed(2));
        stage.style.setProperty("--rx", (-y * 4).toFixed(2));
      });
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--ry", 0);
        stage.style.setProperty("--rx", 0);
      });
    }
  }

  /* ---------- Testimonials ---------- */
  const feedback = $("#feedback");
  const quotes = $("#quotes");
  if (feedback && quotes) {
    if (CONFIG.testimonials.length) {
      quotes.textContent = "";
      CONFIG.testimonials.forEach((t) => {
        const fig = document.createElement("figure");
        fig.className = "quote card reveal in";
        const bq = document.createElement("blockquote");
        bq.textContent = t.quote;
        const cap = document.createElement("figcaption");
        const strong = document.createElement("strong");
        strong.textContent = t.name;
        cap.append(strong, t.role || "");
        fig.append(bq, cap);
        quotes.append(fig);
      });
      feedback.hidden = false;
    } else if (location.search.includes("preview=testimonials")) {
      // Layout preview only: /?preview=testimonials
      feedback.hidden = false;
      $$(".reveal", feedback).forEach((el) => el.classList.add("in"));
    }
  }

  /* ---------- Services → prefill project type ---------- */
  const typeSelect = $("#f-type");
  $$("[data-service]").forEach((a) => {
    a.addEventListener("click", () => {
      const v = a.dataset.service;
      if (!v || !typeSelect) return;
      const opt = Array.from(typeSelect.options).find((o) => o.textContent.trim() === v);
      if (opt) typeSelect.value = opt.value || opt.textContent;
    });
  });

  /* ---------- Contact form ---------- */
  const form = $("#inquiry");
  const status = $("#form-status");
  const setStatus = (msg, cls) => { status.textContent = msg; status.className = "status " + (cls || ""); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");
    let firstInvalid = null;
    $$("input[required], select[required], textarea[required]", form).forEach((el) => {
      const bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      el.closest(".field").classList.toggle("invalid", bad);
      el.setAttribute("aria-invalid", String(bad));
      if (bad && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      setStatus("Please complete the highlighted fields.", "error");
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    if (data.get("_gotcha")) return; // honeypot

    if (CONFIG.formspree) {
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      try {
        const res = await fetch(CONFIG.formspree, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        setStatus("Thank you. Your inquiry has been sent and I'll reply by email.", "ok");
      } catch (err) {
        setStatus("Something went wrong sending the form. Please email " + CONFIG.email + " instead.", "error");
      } finally {
        btn.disabled = false;
      }
      return;
    }

    const lines = [
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Company: " + (data.get("company") || "-"),
      "Project type: " + data.get("project_type"),
      "",
      data.get("message")
    ];
    const subject = "Project inquiry from " + data.get("name");
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    setStatus("Your email app should open with the details filled in. If it doesn't, write to " + CONFIG.email + ".", "ok");
  });

  $$("input, select, textarea", form).forEach((el) => el.addEventListener("input", () => {
    el.closest(".field").classList.remove("invalid");
    el.removeAttribute("aria-invalid");
  }));
})();
