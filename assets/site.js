(function () {
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function flash(btn, label) {
    var old = btn.textContent;
    btn.textContent = label;
    btn.classList.add("is-done");
    setTimeout(function () {
      btn.textContent = old;
      btn.classList.remove("is-done");
    }, 1400);
  }

  function copyText(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(btn, "已复制"); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); flash(btn, "已复制"); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".kv-row");
      var code = row && row.querySelector("[data-copy-text]");
      if (code) copyText(code.textContent.trim(), btn);
    });
  });

  document.querySelectorAll("[data-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      tab.parentElement.querySelectorAll("[data-tab]").forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", String(on));
      });
      document.querySelectorAll("[data-tab-panel]").forEach(function (p) {
        p.classList.toggle("is-on", p.getAttribute("data-tab-panel") === key);
      });
    });
  });

  var codeBox = document.querySelector("[data-code]");
  if (codeBox) {
    codeBox.querySelectorAll("[data-code-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-code-tab");
        codeBox.querySelectorAll("[data-code-tab]").forEach(function (t) { t.classList.toggle("is-on", t === tab); });
        codeBox.querySelectorAll("[data-code-panel]").forEach(function (p) {
          p.classList.toggle("is-on", p.getAttribute("data-code-panel") === key);
        });
      });
    });
    var copyCode = codeBox.querySelector("[data-copy-code]");
    if (copyCode) {
      copyCode.addEventListener("click", function () {
        var panel = codeBox.querySelector("[data-code-panel].is-on");
        if (panel) copyText(panel.textContent, copyCode);
      });
    }
  }

  // Announcement bar: fade between messages, pause on hover,
  // stay static under prefers-reduced-motion.
  var msgs = document.querySelectorAll(".announce-msg");
  if (msgs.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var idx = 0, paused = false;
    var bar = document.querySelector(".announce");
    if (bar) {
      bar.addEventListener("mouseenter", function () { paused = true; });
      bar.addEventListener("mouseleave", function () { paused = false; });
    }
    setInterval(function () {
      if (paused) return;
      msgs[idx].classList.remove("is-on");
      idx = (idx + 1) % msgs.length;
      msgs[idx].classList.add("is-on");
    }, 6000);
  }
})();
