(function () {
  "use strict";

  var root = document.documentElement;
  var SLOW_MS = 4000; // an image still loading after this long is treated as slow

  function bust(src) {
    return src.split("?")[0] + "?retry=" + Date.now();
  }

  /* ---------- Theme toggle ---------- */
  var toggles = document.querySelectorAll("[data-theme-toggle]");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var label = "Switch to " + (theme === "dark" ? "light" : "dark") + " mode";
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  });

  /* ---------- Show the small nav toggle once the top bar is out of view ---------- */
  var topbar = document.querySelector(".topbar");
  if (topbar && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(topbar);
  }

  /* ---------- Highlight the nav link for the section in view ---------- */
  var links = document.querySelectorAll(".nav__list a");
  var sections = [];
  links.forEach(function (link) {
    var section = document.querySelector(link.getAttribute("href"));
    if (section) sections.push({ link: link, section: section });
  });

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        sections.forEach(function (item) {
          if (item.section === entry.target) item.link.setAttribute("aria-current", "true");
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });

    sections.forEach(function (item) { spy.observe(item.section); });
  }

  /* ---------- Loading, slow and error states for images ---------- */
  var medias = document.querySelectorAll("[data-media]");

  medias.forEach(function (media) {
    var img = media.querySelector("img");
    if (!img) return;
    var timer;

    function setState(state) { media.setAttribute("data-state", state); }

    function done() { clearTimeout(timer); setState("loaded"); }
    function fail() { clearTimeout(timer); setState("error"); }

    function start() {
      clearTimeout(timer);
      setState("loading");
      timer = setTimeout(function () {
        if (media.getAttribute("data-state") === "loading") setState("slow");
      }, SLOW_MS);
    }

    media.retry = function () {
      start();
      img.src = bust(img.src);
    };

    img.addEventListener("load", done);
    img.addEventListener("error", fail);

    if (img.complete) {
      if (img.naturalWidth > 0) done(); else fail();
    } else {
      start();
    }

    var retryBtn = media.querySelector("[data-retry]");
    if (retryBtn) retryBtn.addEventListener("click", media.retry);
  });

  /* ---------- Empty state: only appears if a list has no items ---------- */
  document.querySelectorAll("[data-list]").forEach(function (list) {
    if (list.children.length > 0) return;

    var box = document.createElement("div");
    box.className = "empty-state";

    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "icon icon--lg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-inbox");
    icon.appendChild(use);

    var title = document.createElement("h3");
    title.textContent = list.getAttribute("data-empty-title") || "Nothing here yet";
    var text = document.createElement("p");
    text.textContent = list.getAttribute("data-empty-text") || "Check back soon.";

    box.appendChild(icon);
    box.appendChild(title);
    box.appendChild(text);
    list.insertAdjacentElement("afterend", box);
    list.hidden = true;
  });

  /* ---------- Connection banner: offline, slow, back online ---------- */
  var banner = document.querySelector("[data-net-banner]");
  var bannerText = document.querySelector("[data-net-message]");
  var bannerClose = document.querySelector("[data-net-close]");
  var bannerTimer;

  function showBanner(kind, text, autoHideMs) {
    if (!banner) return;
    clearTimeout(bannerTimer);
    banner.setAttribute("data-kind", kind);
    bannerText.textContent = text;
    banner.hidden = false;
    if (autoHideMs) bannerTimer = setTimeout(hideBanner, autoHideMs);
  }

  function hideBanner() { if (banner) banner.hidden = true; }

  if (bannerClose) bannerClose.addEventListener("click", hideBanner);

  function isSlow() {
    var c = navigator.connection;
    return !!(c && /2g$/.test(c.effectiveType || ""));
  }

  function checkConnection() {
    if (!navigator.onLine) {
      showBanner("offline", "You're offline. Images may not load until you reconnect.");
    } else if (isSlow()) {
      showBanner("slow", "Your connection looks slow. Images may take a moment to load.");
    } else if (banner && banner.getAttribute("data-kind") === "slow") {
      hideBanner();
    }
  }

  function retryFailed() {
    medias.forEach(function (media) {
      if (media.getAttribute("data-state") === "error" && media.retry) media.retry();
    });
  }

  window.addEventListener("offline", checkConnection);
  window.addEventListener("online", function () {
    showBanner("online", "You're back online.", 3000);
    retryFailed();
  });
  if (navigator.connection && navigator.connection.addEventListener) {
    navigator.connection.addEventListener("change", checkConnection);
  }
  checkConnection();

  /* ---------- Footer year ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
