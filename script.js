/* Shekhawati Logistics — mobile menu and quote form */
(() => {
  "use strict";

  // Mobile menu
  const btn = document.querySelector(".menu-btn");
  const nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Quote form: validate, then open the visitor's email app
  const form = document.getElementById("quoteForm");
  if (form) {
    const status = document.getElementById("quoteStatus");
    const rules = {
      name: (v) => v.trim().length >= 2,
      phone: (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "")),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      from: (v) => v.trim() !== "",
      to: (v) => v.trim() !== "",
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let firstBad = null;
      Object.keys(rules).forEach((name) => {
        const input = form.elements[name];
        const ok = rules[name](input.value);
        input.setAttribute("aria-invalid", String(!ok));
        if (!ok && !firstBad) firstBad = input;
      });

      if (firstBad) {
        firstBad.focus();
        status.className = "form__status is-err";
        status.textContent = "Please check the highlighted fields.";
        return;
      }

      const f = Object.fromEntries(new FormData(form).entries());
      const subject = `Freight quote: ${f.from} to ${f.to}`;
      const body = [
        `Name: ${f.name}`, `Mobile: ${f.phone}`, `Email: ${f.email}`,
        `Pickup: ${f.from}`, `Delivery: ${f.to}`, f.message ? `\nCargo details:\n${f.message}` : "",
      ].filter(Boolean).join("\n");

      window.location.href = `mailto:bng@shekhawatilogistics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.className = "form__status is-ok";
      status.textContent = "Your email app should open with the details filled in. You can also call 90088 98260.";
    });
  }

  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
