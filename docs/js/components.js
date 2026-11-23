    const menu = document.querySelector("#menu");
    const links = document.querySelector("#top-links");
    menu.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("open", !open);
      document.body.classList.toggle("locked", !open);
    });
    links.addEventListener("click", () => {
      menu.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
      document.body.classList.remove("locked");
    });

    document.querySelectorAll('[role="tablist"]').forEach(list => {
      const tabs = [...list.querySelectorAll('[role="tab"]')];
      const activateTab = active => {
        tabs.forEach(tab => {
          const selected = tab === active;
          tab.setAttribute("aria-selected", String(selected));
          const panel = document.getElementById(tab.getAttribute("aria-controls"));
          if (panel) panel.hidden = !selected;
        });
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tab));
        tab.addEventListener("keydown", event => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          const delta = event.key === "ArrowRight" ? 1 : -1;
          const next = tabs[(index + delta + tabs.length) % tabs.length];
          activateTab(next);
          next.focus();
        });
      });
    });

    const bottomIcons = {
      Home: { on: "assets/icons/house-filled.svg", off: "assets/icons/house.svg" },
      Messages: { on: "assets/icons/comment-right.svg", off: "assets/icons/comment-right.svg" },
      Activity: { on: "assets/icons/list.svg", off: "assets/icons/list.svg" },
      Me: { on: "assets/icons/person-circle.svg", off: "assets/icons/person-circle.svg" }
    };
    document.querySelectorAll(".bottom-tab-bar").forEach(bar => {
      const items = [...bar.querySelectorAll(".bottom-tab")];
      items.forEach(item => {
        item.addEventListener("click", () => {
          items.forEach(tab => {
            const current = tab === item;
            if (current) tab.setAttribute("aria-current", "page");
            else tab.removeAttribute("aria-current");
            const label = tab.querySelector("span:last-child").textContent.trim();
            const img = tab.querySelector("img");
            const icons = bottomIcons[label];
            if (img && icons) img.src = current ? icons.on : icons.off;
          });
        });
      });
    });

    document.querySelectorAll(".top-nav-web").forEach(nav => {
      const items = [...nav.querySelectorAll(".top-nav-item")];
      items.forEach(item => {
        item.addEventListener("click", () => {
          items.forEach(tab => {
            if (tab === item) tab.setAttribute("aria-current", "page");
            else tab.removeAttribute("aria-current");
          });
        });
      });
    });

    document.querySelectorAll(".chip[aria-pressed]").forEach(control => {
      control.addEventListener("click", () => {
        const group = control.parentElement.querySelectorAll("[aria-pressed]");
        group.forEach(item => item.setAttribute("aria-pressed", String(item === control)));
      });
    });
    document.querySelectorAll(".quick-replies[data-choice-group]").forEach(group => {
      group.querySelectorAll(".reply-chip[aria-pressed]").forEach(control => {
        control.addEventListener("click", () => {
          group.querySelectorAll(".reply-chip[aria-pressed]").forEach(item => item.setAttribute("aria-pressed", String(item === control)));
        });
      });
    });
    document.querySelectorAll(".multi-replies .reply-chip[aria-pressed]").forEach(control => {
      control.addEventListener("click", () => {
        control.setAttribute("aria-pressed", String(control.getAttribute("aria-pressed") !== "true"));
      });
    });
    const messageCompose = document.querySelector("#message-compose");
    const messageSend = document.querySelector("#message-send");
    if (messageCompose && messageSend) {
      const syncComposer = () => {
        const ready = messageCompose.value.trim().length > 0;
        messageSend.disabled = !ready;
        messageSend.classList.toggle("ready", ready);
      };
      messageCompose.addEventListener("input", syncComposer);
      syncComposer();
    }
    document.querySelectorAll('.segmented[role="radiogroup"]').forEach(group => {
      const segments = [...group.querySelectorAll('[role="radio"]')];
      const select = segment => {
        segments.forEach(item => {
          const chosen = item === segment;
          item.setAttribute("aria-checked", String(chosen));
          item.tabIndex = chosen ? 0 : -1;
        });
      };
      segments.forEach((segment, index) => {
        segment.addEventListener("click", () => select(segment));
        segment.addEventListener("keydown", event => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          const delta = event.key === "ArrowRight" ? 1 : -1;
          const next = segments[(index + delta + segments.length) % segments.length];
          select(next);
          next.focus();
        });
      });
    });

    document.querySelectorAll("[data-choice-group]").forEach(group => {
      const choices = [...group.querySelectorAll('[role="radio"]')];
      choices.forEach(choice => {
        choice.addEventListener("click", () => {
          choices.forEach(item => item.setAttribute("aria-checked", String(item === choice)));
        });
      });
    });

    document.querySelectorAll(".banner .dismiss").forEach(button => {
      button.addEventListener("click", () => button.closest(".banner").remove());
    });

    const note = document.querySelector("#tf-note");
    const noteCount = document.querySelector("#tf-note-count");
    if (note && noteCount) {
      const syncCount = () => { noteCount.textContent = note.value.length + " / 200"; };
      note.addEventListener("input", syncCount);
      syncCount();
    }

    document.querySelectorAll(".dropdown").forEach(dropdown => {
      const trigger = dropdown.querySelector(".dropdown-trigger");
      const menu = dropdown.querySelector(".dropdown-menu");
      if (!trigger || !menu) return;
      const close = () => { trigger.setAttribute("aria-expanded", "false"); menu.hidden = true; };
      trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") !== "true";
        trigger.setAttribute("aria-expanded", String(open));
        menu.hidden = !open;
      });
      menu.querySelectorAll('[role="option"]').forEach(option => {
        option.addEventListener("click", () => {
          const label = trigger.querySelector("span");
          if (label) label.textContent = option.textContent;
          menu.querySelectorAll('[role="option"]').forEach(item => item.setAttribute("aria-selected", String(item === option)));
          close();
        });
      });
      document.addEventListener("click", event => { if (!dropdown.contains(event.target)) close(); });
    });

    const calGrid = document.querySelector("#cal-grid");
    const calLabel = document.querySelector("#cal-date-label");
    if (calGrid) {
      const disabled = new Set([5, 17, 20]);
      const today = 3;
      let selected = 8;
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const blanks = 3;
      for (let day = 1; day <= 30; day++) {
        if (day === 1) {
          for (let i = 0; i < blanks; i++) {
            const spacer = document.createElement("span");
            spacer.setAttribute("aria-hidden", "true");
            calGrid.appendChild(spacer);
          }
        }
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(day);
        button.disabled = disabled.has(day);
        if (day === today) button.setAttribute("aria-current", "date");
        button.setAttribute("aria-selected", String(day === selected));
        button.addEventListener("click", () => {
          selected = day;
          calGrid.querySelectorAll("button").forEach(item => item.setAttribute("aria-selected", String(item === button)));
          if (calLabel) calLabel.textContent = weekday[(blanks + day - 1) % 7] + ", April " + day;
        });
        calGrid.appendChild(button);
      }
    }

    document.querySelectorAll(".time-slots").forEach(group => {
      const slots = [...group.querySelectorAll("button")];
      slots.forEach(slot => {
        slot.addEventListener("click", () => {
          slots.forEach(item => {
            const on = item === slot;
            item.setAttribute("aria-pressed", String(on));
            item.setAttribute("aria-checked", String(on));
          });
        });
      });
    });

    const slider = document.querySelector(".slider input[type='range']");
    const sliderValue = document.querySelector("#slider-value");
    const syncSlider = () => {
      if (!slider) return;
      const fill = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty("--fill", fill + "%");
      if (sliderValue) sliderValue.textContent = slider.value;
      slider.setAttribute("aria-valuetext", slider.value + " weeks");
    };
    if (slider) {
      slider.addEventListener("input", syncSlider);
      syncSlider();
    }

    const stars = [...document.querySelectorAll(".stars[role='radiogroup'] button")];
    stars.forEach((star, index) => {
      const paint = value => {
        stars.forEach((item, i) => item.setAttribute("aria-checked", String(i <= value)));
      };
      star.addEventListener("click", () => paint(index));
    });

    const otpBoxes = [...document.querySelectorAll("#otp-row .otp-box")];
    otpBoxes.forEach((box, index) => {
      box.addEventListener("input", () => {
        box.value = box.value.replace(/\D/g, "").slice(0, 1);
        if (box.value && otpBoxes[index + 1]) otpBoxes[index + 1].focus();
      });
      box.addEventListener("keydown", event => {
        if (event.key === "Backspace" && !box.value && otpBoxes[index - 1]) otpBoxes[index - 1].focus();
      });
    });

    const dateCal = document.querySelector(".date-cal");
    if (dateCal) dateCal.addEventListener("click", () => { window.location.hash = "calendar"; });

    const indeterminate = document.querySelector("#cb-indeterminate");
    if (indeterminate) indeterminate.indeterminate = true;

    const modal = document.querySelector("#component-modal");
    document.querySelector("#open-modal").addEventListener("click", () => modal.showModal());
    document.querySelector("#close-modal").addEventListener("click", () => modal.close());
    document.querySelector("#confirm-modal").addEventListener("click", () => {
      modal.close();
      showToast();
    });
    modal.addEventListener("click", event => {
      if (event.target === modal) modal.close();
    });

    const toast = document.querySelector("#toast");
    let toastTimer;
    document.querySelector("#show-toast").addEventListener("click", showToast);
    document.querySelector("#close-toast").addEventListener("click", () => toast.hidden = true);
    function showToast() {
      clearTimeout(toastTimer);
      toast.hidden = false;
      toastTimer = setTimeout(() => toast.hidden = true, 5000);
    }

    const sections = [...document.querySelectorAll("main section[id]")];
    const sideLinks = [...document.querySelectorAll(".side-nav a")];
    const navGroups = [...document.querySelectorAll("[data-nav-group]")];
    const navStorageKey = "ih-anatomy-nav-open";

    function setGroupOpen(group, open, persist) {
      const toggle = group.querySelector(".nav-toggle");
      const panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
      if (!toggle || !panel) return;
      toggle.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      if (persist) {
        const state = {};
        navGroups.forEach(item => {
          const button = item.querySelector(".nav-toggle");
          if (button) state[item.dataset.navGroup] = button.getAttribute("aria-expanded") === "true";
        });
        try { localStorage.setItem(navStorageKey, JSON.stringify(state)); } catch (err) {}
      }
    }

    function openGroupForHash(hash) {
      const id = (hash || "").replace(/^#/, "");
      if (!id) return;
      const match = navGroups.find(group => {
        return [...group.querySelectorAll("a")].some(link => link.hash === "#" + id);
      });
      if (match) setGroupOpen(match, true, false);
    }

    try {
      const stored = JSON.parse(localStorage.getItem(navStorageKey) || "null");
      if (stored && typeof stored === "object") {
        navGroups.forEach(group => {
          if (Object.prototype.hasOwnProperty.call(stored, group.dataset.navGroup)) {
            setGroupOpen(group, Boolean(stored[group.dataset.navGroup]), false);
          }
        });
      }
    } catch (err) {}

    openGroupForHash(location.hash);

    document.querySelectorAll(".nav-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const group = button.closest("[data-nav-group]");
        const open = button.getAttribute("aria-expanded") !== "true";
        setGroupOpen(group, open, true);
      });
    });

    sideLinks.forEach(link => {
      link.addEventListener("click", () => openGroupForHash(link.hash));
    });

    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sideLinks.forEach(link => link.setAttribute("aria-current", String(link.hash === "#" + visible.target.id)));
    }, { rootMargin: "-20% 0px -65%", threshold: [0, .25, .5] });
    sections.forEach(section => observer.observe(section));
  
