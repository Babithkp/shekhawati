/* Shekhawati Logistics — interactions */
(() => {
  "use strict";
  document.documentElement.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Data (from the company deck) ---------- */
  const HQ = {
    id: "blr", city: "Bangalore", label: "Corporate head office", state: "Karnataka",
    lat: 13.07, lon: 77.42,
    addr: "No. 23, 1st Floor, Dr. Devaraj URS Truck Terminal, Dasanapura, Nelamangala, Bangalore, Karnataka 562162",
    phones: ["9008898260", "9886966001"], side: "left",
  };
  const BRANCHES = [
    { id: "nmb", city: "Navi Mumbai", state: "Maharashtra", lat: 19.03, lon: 73.10, side: "left",
      addr: "D-152, First Floor, Disma Complex, Kalamboli, Navi Mumbai 410 218", phones: ["9284956732", "7284956732"] },
    { id: "vap", city: "Vapi", state: "Gujarat", lat: 20.37, lon: 72.90, side: "left",
      addr: "305, Brahmdev Complex, 3rd Floor, opp. Brahmdev Mandir, N.H. 8, Balitha, Vapi 396 191", phones: ["9694254008"] },
    { id: "gur", city: "Gurugram", state: "Haryana", lat: 28.40, lon: 76.95, side: "right",
      addr: "IMT Road, near Haryana Gramin Bank, Hayatpur, Distt. Gurugram, Haryana 122505", phones: ["9899580721", "9312580721"] },
    { id: "kat", city: "Katni", state: "Madhya Pradesh", lat: 23.83, lon: 80.39, side: "right",
      addr: "Near Madhav Nagar Gate, Jabalpur Road, Katni, Madhya Pradesh 483501", phones: ["9752588725"] },
    { id: "jam", city: "Jamshedpur", state: "Jharkhand", lat: 22.80, lon: 86.18, side: "right",
      addr: "NH 33, beside Sahara City, near Kumrum Basti, Pardih Mango, Jamshedpur 831 012", phones: ["9334611977", "9771234905"] },
    { id: "rai", city: "Raipur", state: "Chhattisgarh", lat: 21.25, lon: 81.63, side: "right",
      addr: "Shop No. 6, Sinha Complex, Ganpat Chowk, Ring Road No. 2, Heerapur, Raipur 492 099 (C.G.)", phones: ["7688833385", "9079869068"] },
    { id: "nag", city: "Nagpur", state: "Maharashtra", lat: 21.15, lon: 79.18, side: "left",
      addr: "Nishan Crane Building, Bhawani Kata, Kapsi, Bhandara Road, Nagpur 440008 (MH)", phones: ["9649325770", "8319395095"] },
    { id: "hyd", city: "Hyderabad", state: "Telangana", lat: 17.53, lon: 78.26, side: "left",
      addr: "Plot No. 6, 2nd Floor, beside Kar Plaza, Muthangi Village, Patancheru Mandal, Dist. Sangareddy, Telangana 502300", phones: ["9553015015"] },
    { id: "che", city: "Chennai", state: "Tamil Nadu", lat: 13.16, lon: 80.20, side: "right",
      addr: "No. 242/241, 22nd Cross Street, Sakthivel Nagar Main Road, Puzhal, Chennai 600066", phones: ["8122570776"] },
  ];
  const fmtPhone = (p) => `+91 ${p}`;

  /* ---------- Image skeletons ---------- */
  $$(".skeleton").forEach((wrap) => {
    const img = $("img", wrap);
    if (!img) return;
    const done = () => wrap.classList.add("is-loaded");
    if (img.complete && img.naturalWidth) done();
    else { img.addEventListener("load", done, { once: true }); img.addEventListener("error", done, { once: true }); }
  });

  /* ---------- Fluid island menu ---------- */
  const burger = $(".burger");
  const menu = $("#menu");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
    if (open) setTimeout(() => $("a", menu)?.focus({ preventScroll: true }), 300);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });

  /* ---------- Scroll reveal (IntersectionObserver only) ---------- */
  // Stagger siblings that share a parent
  const groups = new Map();
  $$(".reveal").forEach((el) => {
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    groups.set(p, i + 1);
    el.style.setProperty("--d", `${Math.min(i, 6) * 80}ms`);
  });
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  $$(".reveal").forEach((el) => revealIO.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      countIO.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      if (reduceMotion) { el.textContent = target.toFixed(dec); return; }
      const dur = 1800;
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 4);
        el.textContent = (target * eased).toFixed(dec);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Nav scroll spy ---------- */
  const spyLinks = $$(".nav__links a[data-spy]");
  const spyIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      spyLinks.forEach((a) => {
        if (a.dataset.spy === en.target.id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  spyLinks.forEach((a) => { const s = document.getElementById(a.dataset.spy); if (s) spyIO.observe(s); });
  const heroIO = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) spyLinks.forEach((a) => a.removeAttribute("aria-current"));
  }, { rootMargin: "-45% 0px -50% 0px" });
  heroIO.observe($("#top"));

  /* ---------- Client marquee: duplicate for a seamless loop ---------- */
  const track = $(".marquee__track");
  if (track) {
    [...track.children].forEach((li) => {
      const c = li.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      $("img", c).alt = "";
      track.appendChild(c);
    });
  }

  /* ---------- Fleet carousel ---------- */
  const fleet = $("#fleetTrack");
  if (fleet) {
    const prev = $('[data-fleet="prev"]');
    const next = $('[data-fleet="next"]');
    const step = () => (fleet.firstElementChild?.getBoundingClientRect().width || 320) + 16;
    prev.addEventListener("click", () => fleet.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    next.addEventListener("click", () => fleet.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
    const sync = () => {
      prev.disabled = fleet.scrollLeft < 8;
      next.disabled = fleet.scrollLeft + fleet.clientWidth > fleet.scrollWidth - 8;
    };
    fleet.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener("resize", sync);
    sync();
    fleet.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
  }

  /* ---------- India network map ---------- */
  const svg = $("#indiaMap");
  const NS = "http://www.w3.org/2000/svg";
  const project = (lon, lat) => [(lon - 67.5) * 18.2 + 24, (37.2 - lat) * 19];
  // Coarse outline of India (lon, lat) used only to mask the dot grid
  const OUTLINE = [
    [74.4, 34.8], [75.9, 35.9], [77.8, 35.5], [78.9, 34.3], [78.6, 33.0], [79.3, 32.5], [78.8, 31.3], [79.8, 30.9], [81.0, 30.2],
    [80.1, 28.8], [81.3, 28.1], [83.3, 27.4], [84.6, 27.3], [85.7, 26.7], [87.0, 26.4], [88.0, 26.4], [88.0, 27.1], [88.2, 27.9],
    [88.8, 27.3], [89.6, 26.8], [91.8, 26.8], [92.1, 27.4], [94.0, 28.9], [95.4, 29.1], [96.1, 29.4], [97.4, 28.3], [97.0, 27.2],
    [95.5, 26.6], [95.1, 25.9], [94.6, 25.1], [94.2, 23.9], [93.4, 23.9], [93.2, 22.3], [92.6, 22.0], [92.3, 23.5], [92.1, 24.6],
    [92.0, 25.1], [90.4, 25.2], [89.8, 25.4], [89.8, 26.1], [88.6, 26.4], [88.2, 25.8], [88.6, 25.1], [88.1, 24.5], [88.7, 24.1],
    [88.8, 23.2], [89.0, 22.0], [88.9, 21.6], [87.9, 21.7], [86.9, 21.1], [86.4, 20.0], [85.2, 19.4], [84.2, 18.4], [82.4, 17.0],
    [81.2, 16.0], [80.3, 15.6], [80.1, 13.6], [79.9, 11.5], [79.8, 10.3], [79.2, 9.3], [78.1, 8.6], [77.5, 8.1], [76.5, 9.0],
    [76.2, 10.0], [75.6, 11.5], [74.8, 12.9], [74.4, 14.6], [73.7, 15.7], [73.2, 17.4], [72.8, 19.0], [72.8, 20.5], [72.6, 21.3],
    [72.6, 22.3], [72.0, 21.3], [71.0, 20.8], [70.0, 21.3], [69.0, 22.3], [70.1, 22.9], [68.5, 23.6], [68.8, 24.3], [70.0, 24.4],
    [71.1, 24.6], [70.6, 25.7], [70.0, 26.6], [69.6, 27.1], [70.4, 28.0], [71.9, 28.0], [72.9, 29.1], [73.4, 29.9], [74.0, 30.4],
    [74.6, 31.0], [74.6, 31.9], [75.4, 32.3], [74.6, 32.8], [74.0, 33.2], [73.9, 34.0],
  ].map(([lon, lat]) => project(lon, lat));
  const inside = (x, y) => {
    let c = false;
    for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
      const [xi, yi] = OUTLINE[i]; const [xj, yj] = OUTLINE[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const el = (tag, attrs = {}, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    parent && parent.appendChild(n);
    return n;
  };

  if (svg) {
    const dots = el("g", { "aria-hidden": "true" });
    const GAP = 10;
    for (let y = 0; y <= 600; y += GAP) {
      for (let x = 0; x <= 600; x += GAP) {
        if (inside(x, y)) el("circle", { cx: x, cy: y, r: 1.8, class: "map__dot" }, dots);
      }
    }

    const [hx, hy] = project(HQ.lon, HQ.lat);
    const arcs = el("g", { "aria-hidden": "true" });
    const pins = el("g");
    const arcById = {};
    BRANCHES.forEach((b) => {
      const [x, y] = project(b.lon, b.lat);
      const mx = (hx + x) / 2; const my = (hy + y) / 2;
      const dx = x - hx; const dy = y - hy;
      const len = Math.hypot(dx, dy);
      const bend = Math.min(60, len * 0.22);
      const cx = mx + (-dy / len) * bend * (b.side === "left" ? -1 : 1);
      const cy = my + (dx / len) * bend * (b.side === "left" ? -1 : 1);
      arcById[b.id] = el("path", { d: `M${hx},${hy} Q${cx},${cy} ${x},${y}`, class: "map__arc", id: `arc-${b.id}` }, arcs);
    });

    const truck = el("circle", { r: 4, class: "map__truck", "aria-hidden": "true" });
    let motion = null;

    const pinFor = (b, isHQ) => {
      const [x, y] = project(b.lon, b.lat);
      const g = el("g", { class: `map__pin${isHQ ? " map__hq" : ""}`, tabindex: "0", role: "button", "aria-label": `${b.city}, ${b.state}` }, pins);
      el("circle", { cx: x, cy: y, r: 14, class: "halo" }, g);
      el("circle", { cx: x, cy: y, r: isHQ ? 6 : 4.5, class: "core" }, g);
      const t = el("text", { x: b.side === "left" ? x - 10 : x + 10, y: y + 4, "text-anchor": b.side === "left" ? "end" : "start" }, g);
      t.textContent = isHQ ? `${b.city} HQ` : b.city;
      g.dataset.id = b.id;
      return g;
    };
    const all = [HQ, ...BRANCHES];
    const pinEls = all.map((b, i) => pinFor(b, i === 0));

    // Mobile chip list mirrors the pins
    const list = $("#branchList");
    const chips = all.map((b) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button"; btn.textContent = b.city; btn.dataset.id = b.id;
      btn.setAttribute("aria-pressed", "false");
      li.appendChild(btn); list.appendChild(li);
      return btn;
    });

    const panel = $(".branch-panel");
    const select = (id, user = false) => {
      const b = all.find((x) => x.id === id);
      if (!b) return;
      pinEls.forEach((p) => p.classList.toggle("is-active", p.dataset.id === id));
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.id === id)));
      Object.entries(arcById).forEach(([k, a]) => a.classList.toggle("is-active", k === id));
      $("#bpLabel").textContent = b === HQ ? "Corporate head office" : "Branch office";
      $("#bpCity").textContent = `${b.city}, ${b.state}`;
      $("#bpAddr").textContent = b.addr;
      $("#bpPhones").innerHTML = b.phones.map((p) => `<a class="mono" href="tel:+91${p}">${fmtPhone(p)}</a>`).join("");
      if (user) { panel.classList.remove("is-swap"); void panel.offsetWidth; panel.classList.add("is-swap"); }
      if (motion) motion.remove();
      if (b !== HQ && !reduceMotion) {
        motion = el("animateMotion", { dur: "2.6s", repeatCount: "indefinite", rotate: "auto" }, truck);
        const mp = el("mpath", {}, motion);
        mp.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#arc-${b.id}`);
        mp.setAttribute("href", `#arc-${b.id}`);
        truck.style.display = "";
        motion.beginElement?.();
      } else truck.style.display = "none";
    };
    pinEls.forEach((p) => {
      p.addEventListener("click", () => { stopAuto(); select(p.dataset.id, true); });
      p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stopAuto(); select(p.dataset.id, true); } });
    });
    chips.forEach((c) => c.addEventListener("click", () => { stopAuto(); select(c.dataset.id, true); }));

    // Cycle through branches until the visitor interacts
    let auto = null; let autoIdx = 0;
    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };
    select("blr");
    if (!reduceMotion) {
      new IntersectionObserver(([en], obs) => {
        if (!en.isIntersecting) return;
        obs.disconnect();
        auto = setInterval(() => { autoIdx = (autoIdx + 1) % all.length; select(all[autoIdx].id); }, 3200);
      }, { threshold: 0.4 }).observe(svg);
    }
  }

  /* ---------- Branch contact list ---------- */
  const bc = $("#branchContacts");
  if (bc) {
    bc.innerHTML = BRANCHES.map((b) => `
      <li><span>${b.city === "Katni" ? "Madhya Pradesh" : b.city}</span>
        <div>${b.phones.map((p) => `<a class="mono" href="tel:+91${p}">${fmtPhone(p)}</a>`).join("")}</div>
      </li>`).join("");
  }

  /* ---------- Quote form ---------- */
  const form = $("#quoteForm");
  if (form) {
    const status = $("#quoteStatus");
    const btn = $("#quoteBtn");
    const rules = {
      name: (v) => (v.trim().length < 2 ? "Enter your name so we know who to call back." : ""),
      phone: (v) => {
        const d = v.replace(/[^\d]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
        return /^[6-9]\d{9}$/.test(d) ? "" : "Enter a 10 digit Indian mobile number.";
      },
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email, for example name@company.in."),
      from: (v) => (v.trim() ? "" : "Enter the pickup city."),
      to: (v) => (v.trim() ? "" : "Enter the delivery city."),
      type: (v) => (v ? "" : "Choose the type of load."),
    };
    const check = (name) => {
      const input = form.elements[name];
      const msg = rules[name](input.value);
      const field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", String(!!msg));
      const err = $(`#e-${name}`);
      err.textContent = msg;
      if (msg) input.setAttribute("aria-describedby", `e-${name}`); else input.removeAttribute("aria-describedby");
      return !msg;
    };
    Object.keys(rules).forEach((n) => {
      const input = form.elements[n];
      input.addEventListener("blur", () => { if (input.value) check(n); });
      input.addEventListener("input", () => { if (input.closest(".field").classList.contains("has-error")) check(n); });
      input.addEventListener("change", () => { if (input.tagName === "SELECT") check(n); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.className = "quote__status"; status.textContent = "";
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        const first = Object.keys(rules).find((n) => form.elements[n].getAttribute("aria-invalid") === "true");
        form.elements[first]?.focus();
        status.classList.add("is-err");
        status.textContent = "Some details are missing. Check the highlighted fields.";
        return;
      }
      const f = Object.fromEntries(new FormData(form).entries());
      const subject = `Freight quote: ${f.from} to ${f.to} (${f.type})`;
      const body = [
        `Name: ${f.name}`, f.company ? `Company: ${f.company}` : "", `Mobile: ${f.phone}`, `Email: ${f.email}`,
        `Pickup: ${f.from}`, `Delivery: ${f.to}`, `Load type: ${f.type}`, f.message ? `\nCargo details:\n${f.message}` : "",
      ].filter(Boolean).join("\n");

      btn.classList.add("is-loading"); btn.disabled = true;
      $("span", btn).textContent = "Preparing your request";
      setTimeout(() => {
        window.location.href = `mailto:bng@shekhawatilogistics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        btn.classList.remove("is-loading"); btn.disabled = false;
        $("span", btn).textContent = "Get a freight quote";
        status.classList.add("is-ok");
        status.innerHTML = 'Your email app is opening with the request filled in. If nothing opens, call <a class="mono" href="tel:+919008898260">+91 9008898260</a> or write to <a href="mailto:bng@shekhawatilogistics.com">bng@shekhawatilogistics.com</a>.';
      }, 700);
    });
  }

  /* ---------- Footer year ---------- */
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
