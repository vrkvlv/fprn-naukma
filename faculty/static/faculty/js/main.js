/* Факультет природничих наук НаУКМА — інтерактивність інтерфейсу */
(function() {
  "use strict";

  document.documentElement.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header shadow on scroll */
  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) {
      return;
    }
    const update = function() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    update();
    window.addEventListener("scroll", update, {
      passive: true
    });
  }

  /* Mobile navigation */
  function initNav() {
    const burger = document.querySelector("[data-burger]");
    const nav = document.querySelector("[data-nav]");
    if (!burger || !nav) {
      return;
    }

    const setOpen = function(open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    burger.addEventListener("click", function() {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function(event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });

    window.matchMedia("(min-width: 1025px)").addEventListener("change", function(mq) {
      if (mq.matches) {
        setOpen(false);
      }
    });
  }

  /* Accessible tabs (programs on the home page) */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function(list) {
      const tabs = Array.from(list.querySelectorAll("[role='tab']"));

      const select = function(tab) {
        tabs.forEach(function(item) {
          const active = item === tab;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
          item.tabIndex = active ? 0 : -1;
          const panel = document.getElementById(item.getAttribute("aria-controls"));
          if (panel) {
            panel.hidden = !active;
          }
        });
      };

      tabs.forEach(function(tab, index) {
        tab.addEventListener("click", function() {
          select(tab);
        });
        tab.addEventListener("keydown", function(event) {
          let next = null;
          if (event.key === "ArrowRight") {
            next = tabs[(index + 1) % tabs.length];
          } else if (event.key === "ArrowLeft") {
            next = tabs[(index - 1 + tabs.length) % tabs.length];
          }
          if (next) {
            event.preventDefault();
            select(next);
            next.focus();
          }
        });
      });
    });
  }

  /* Fade-in of cards when they enter the viewport */
  function initReveal() {
    const selector = [
      ".section-head",
      ".feature",
      ".program-card",
      ".dept-card",
      ".dept-row",
      ".news-card",
      ".unit",
      ".unit-card",
      ".person",
      ".research-list__item",
      ".cta"
    ].join(",");
    const items = document.querySelectorAll(selector);
    if (reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    });

    items.forEach(function(item) {
      const siblings = Array.from(item.parentElement.children);
      const position = siblings.indexOf(item) % 4;
      item.setAttribute("data-reveal", "");
      item.style.setProperty("--delay", position * 0.08 + "s");
      observer.observe(item);
    });
  }

  /* Highlight the current section in the sticky sub-navigation */
  function initSubnav() {
    const links = Array.from(document.querySelectorAll(".subnav__link"));
    if (!links.length || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          links.forEach(function(link) {
            link.classList.toggle("is-active", link.hash === "#" + entry.target.id);
          });
        }
      });
    }, {
      rootMargin: "-45% 0px -50% 0px"
    });
    links.forEach(function(link) {
      const section = document.querySelector(link.hash);
      if (section) {
        observer.observe(section);
      }
    });
  }

  /* Count-up animation for key numbers */
  function initCounters() {
    const values = document.querySelectorAll(".facts__value");
    if (reduceMotion || !values.length || !("IntersectionObserver" in window)) {
      return;
    }
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) {
          return;
        }
        const el = entry.target;
        const target = parseInt(el.textContent, 10);
        observer.unobserve(el);
        if (Number.isNaN(target) || target < 2) {
          return;
        }
        const start = performance.now();
        const duration = 900;
        const tick = function(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(target * eased));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      });
    }, {
      threshold: 0.6
    });
    values.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* "Copy link" button on article pages */
  function initShare() {
    document.querySelectorAll("[data-share]").forEach(function(button) {
      button.addEventListener("click", function() {
        const label = button.textContent;
        const done = function() {
          button.textContent = "Посилання скопійовано ✓";
          window.setTimeout(function() {
            button.textContent = label;
          }, 2000);
        };
        if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
          navigator.share({
            title: document.title,
            url: window.location.href
          }).catch(function() {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).then(done);
        }
      });
    });
  }

  /* Filter programs by department */
  function initFilter() {
    const bar = document.querySelector("[data-filter]");
    if (!bar) {
      return;
    }
    const buttons = Array.from(bar.querySelectorAll("[data-filter-value]"));
    const items = document.querySelectorAll("[data-filter-key]");
    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        const value = button.getAttribute("data-filter-value");
        buttons.forEach(function(item) {
          item.classList.toggle("is-active", item === button);
        });
        items.forEach(function(item) {
          item.hidden = value !== "all" && item.getAttribute("data-filter-key") !== value;
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    initHeader();
    initNav();
    initTabs();
    initReveal();
    initSubnav();
    initCounters();
    initShare();
    initFilter();
  });
})();