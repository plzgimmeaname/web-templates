/* shared site behavior: builds header/footer, fills in config values, handles the form.
   all business details live in js/config.js - you should rarely need to edit this file. */

(function () {
  "use strict";

  const C = SITE_CONFIG;

  // security: refuse to run inside someone else's iframe (clickjacking protection)
  if (window.top !== window.self) {
    document.documentElement.style.display = "none";
    try { window.top.location = window.self.location; } catch (e) { /* blocked by browser, page stays hidden */ }
    return;
  }


  // replace every {{key}} with its value from config.js
  function fillTokens(str) {
    return str.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in C && typeof C[key] === "string" ? C[key] : m));
  }

  function applyTheme() {
    Object.entries(C.theme || {}).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }

  function iconPhone() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
  }

  function linkList(items) {
    return items.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("");
  }

  function buildHeader(activeKey) {
    const links = C.nav.map((l) => `<a href="${l.href}" class="${l.key === activeKey ? "active" : ""}">${l.label}</a>`).join("");
    const badges = C.topBadges.map((b) => `<span>${b}</span>`).join("");

    return `
    <div class="top-bar">
      <div class="container">
        <div class="badges">${badges}</div>
        <div><a href="tel:${C.phoneTel}">${C.phoneDisplay}</a></div>
      </div>
    </div>
    <header class="site-header">
      <div class="container nav-wrap">
        <a href="index.html" class="logo">
          <span class="logo-main">${C.name}</span>
          <span class="logo-sub">${C.tagline}</span>
        </a>
        <nav class="main-nav" id="main-nav">${links}</nav>
        <div class="nav-cta">
          <a href="tel:${C.phoneTel}" class="nav-phone">${iconPhone()}<span class="txt">${C.phoneDisplay}</span></a>
          <a href="contact.html" class="btn btn-primary">Get a Free Quote</a>
          <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
  }

  function buildFooter() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-logo">${C.name}</div>
            <p style="margin-top:12px; font-size:0.9rem;">${C.footerBlurb}</p>
            <p style="font-size:0.82rem;">License #${C.licenseNumber} &middot; ${C.footerInsurance}</p>
          </div>
          <div><h4>Company</h4><ul>${linkList(C.footerCompany)}</ul></div>
          <div><h4>Services</h4><ul>${linkList(C.footerServices)}</ul></div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:${C.phoneTel}">${C.phoneDisplay}</a></li>
              <li>Serving ${C.city} &amp; surrounding areas &mdash; see <a href="service-areas.html">Service Areas</a></li>
              <li>${C.hours}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${C.legalName}. All rights reserved.</span>
          <span>${C.domain}</span>
        </div>
      </div>
    </footer>
    <div class="mobile-call-bar">
      <a href="tel:${C.phoneTel}">${iconPhone()} Call Now: ${C.phoneDisplay}</a>
    </div>`;
  }

  // walk the page and swap {{tokens}} in text, attributes, and the page title
  function fillPage() {
    document.title = fillTokens(document.title);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => { if (n.nodeValue.includes("{{")) n.nodeValue = fillTokens(n.nodeValue); });

    document.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((a) => {
        if (a.value.includes("{{")) el.setAttribute(a.name, fillTokens(a.value));
      });
    });
    document.querySelectorAll("meta[name=description]").forEach((m) => {
      m.content = fillTokens(m.content);
    });
  }

  // map iframes: build the google maps url from config.mapQuery
  function buildMaps() {
    document.querySelectorAll("iframe[data-map-zoom]").forEach((frame) => {
      const zoom = parseInt(frame.getAttribute("data-map-zoom"), 10) || 12;
      frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(C.mapQuery)}&z=${zoom}&output=embed`;
    });
  }

  // security: external links open safely so the other site can't control this tab
  function hardenLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((a) => a.setAttribute("rel", "noopener noreferrer"));
  }

  // quote/contact form
  function initForm() {
    const form = document.getElementById("quote-form");
    if (!form) return;
    const confirmation = document.getElementById("form-confirmation");
    const button = form.querySelector("button[type=submit]");
    let lastSent = 0;

    // security: honeypot field - invisible to people, bots tend to fill it in
    const trap = document.createElement("input");
    trap.type = "text";
    trap.name = "_gotcha";
    trap.tabIndex = -1;
    trap.autocomplete = "off";
    trap.setAttribute("aria-hidden", "true");
    trap.style.cssText = "position:absolute;left:-9999px;opacity:0;height:0;width:0;";
    form.appendChild(trap);

    // cap field lengths so nobody can send huge payloads
    form.querySelectorAll("input[type=text], input[type=tel], input[type=email]").forEach((i) => (i.maxLength = 120));
    const msg = form.querySelector("textarea");
    if (msg) msg.maxLength = 2000;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (trap.value) return; // bot caught, silently ignore
      if (Date.now() - lastSent < 10000) return; // basic rate limit: one send per 10 seconds
      lastSent = Date.now();

      const done = () => { form.style.display = "none"; if (confirmation) confirmation.style.display = "block"; };

      // no endpoint configured: just show the thank-you message (nothing is sent)
      if (!C.formEndpoint || !/^https:\/\//.test(C.formEndpoint)) { done(); return; }

      button.disabled = true;
      try {
        const res = await fetch(C.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error("send failed");
        done();
      } catch (err) {
        button.disabled = false;
        alert(`Sorry, something went wrong. Please call us at ${C.phoneDisplay}.`);
      }
    });
  }

  // gallery filter buttons
  function initGalleryFilter() {
    const buttons = document.querySelectorAll(".filter-bar button");
    const items = document.querySelectorAll("[data-category]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-filter");
        items.forEach((item) => {
          item.style.display = filter === "all" || item.getAttribute("data-category") === filter ? "" : "none";
        });
      });
    });
  }

  function initSite() {
    applyTheme();
    const activeKey = document.body.getAttribute("data-page") || "";
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.innerHTML = buildHeader(activeKey);
    if (footerMount) footerMount.innerHTML = buildFooter();

    fillPage();
    buildMaps();
    hardenLinks();

    // mobile menu toggle
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    if (toggle && nav) toggle.addEventListener("click", () => nav.classList.toggle("open"));

    initForm();
    initGalleryFilter();
  }

  document.addEventListener("DOMContentLoaded", initSite);
})();
