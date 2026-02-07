document.addEventListener("DOMContentLoaded", async () => {

  /* =========================
   Header (partial)
   ========================= */
const headerSlot = document.getElementById("header-slot");

if (headerSlot) {
  try {
    const res = await fetch("partials/header.html", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar header.html");
    headerSlot.innerHTML = await res.text();

    // Activar hamburguesa
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (header && toggle && mobileMenu) {
      toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.textContent = isOpen ? "✕" : "☰";
      });

      mobileMenu.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
          header.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "☰";
        });
      });
    }

  } catch (err) {
    console.error(err);
  }
}

  /* =========================
     Slider Obras Sociales
     ========================= */
  const logosTrack = document.getElementById("logosTrack");
  if (logosTrack) {
    const minWidth = logosTrack.parentElement.offsetWidth * 3;

    while (logosTrack.scrollWidth < minWidth) {
      Array.from(logosTrack.children).forEach(el => {
        logosTrack.appendChild(el.cloneNode(true));
      });
    }
  }

  /* =========================
     Opiniones (partials + slider)
     ========================= */
  const slot = document.getElementById("opiniones-slot");
  if (slot) {
    try {
      const res = await fetch("partials/opiniones.html", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar opiniones.html");
      slot.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      slot.innerHTML = `
        <div class="container">
          <p style="color: rgba(11,18,32,.7);">
            No se pudieron cargar las opiniones. Intentá recargar la página.
          </p>
        </div>
      `;
      
    }

    // Controles del slider de opiniones
    const reviewsTrack = document.getElementById("reviewsTrack");
    const prev = document.getElementById("prevReview");
    const next = document.getElementById("nextReview");

    if (reviewsTrack && prev && next) {
      const scrollByCard = () => {
        const card = reviewsTrack.querySelector(".review-card");
        const gap = 16;
        return (card?.offsetWidth || 320) + gap;
      };

      prev.addEventListener("click", () => {
        reviewsTrack.scrollBy({ left: -scrollByCard(), behavior: "smooth" });
      });

      next.addEventListener("click", () => {
        reviewsTrack.scrollBy({ left: scrollByCard(), behavior: "smooth" });
      });
    }
  }

    /* =========================
    Slider Novedades
     ========================= */
  const novedadesSlot = document.getElementById("novedades-slot");
  if (novedadesSlot) {
    try {
      const res = await fetch("partials/novedades.html", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar novedades.html");
      novedadesSlot.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      novedadesSlot.innerHTML = `
        <div class="container">
          <p style="color: rgba(11,18,32,.7);">
            No se pudieron cargar las novedades. Intentá recargar la página.
          </p>
        </div>
      `;
    }
  }

    /* =========================
    Iconos Sercicios
     ========================= */
  const serviciosSlot = document.getElementById("servicios-slot");
  if (serviciosSlot) {
    try {
      const res = await fetch("partials/servicios.html", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar servicios.html");
      serviciosSlot.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      serviciosSlot.innerHTML = `
        <div class="container">
          <p style="color: rgba(11,18,32,.7);">
            No se pudieron cargar los servicios. Intentá recargar la página.
          </p>
        </div>
      `;
    }
  }

/* =========================
   Modal Servicios (con Lazy Load de videos)
   ========================= */
const modalRoot = document.getElementById("modal-root");

const loadServiciosModal = async () => {
  if (!modalRoot) return false;
  if (modalRoot.dataset.loaded === "1") return true;

  const res = await fetch("partials/servicios-modal.html", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar servicios-modal.html");

  modalRoot.innerHTML = await res.text();
  modalRoot.dataset.loaded = "1";
  return true;
};

const initServiciosModal = async () => {
  try {
    const ok = await loadServiciosModal();
    if (!ok) return;

    const modal = document.getElementById("serviceModal");
    if (!modal) return;

    const items = Array.from(modal.querySelectorAll(".svc-item"));

    // ✅ Lazy load: carga videos solo del item activo
    const loadVideosIn = (el) => {
      if (!el) return;
      const videos = el.querySelectorAll('video.svc-video[data-src]');
      videos.forEach((video) => {
        if (video.dataset.loaded === "1") return;

        const src = video.dataset.src;
        if (!src) return;

        const source = document.createElement("source");
        source.src = src;
        source.type = "video/mp4";
        video.appendChild(source);

        video.load();
        video.dataset.loaded = "1";

        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      });
    };

    // ✅ Lazy unload: frena y libera para no consumir memoria/descarga
    const unloadVideosIn = (el) => {
      if (!el) return;
      el.querySelectorAll("video.svc-video").forEach((video) => {
        try { video.pause(); } catch {}

        video.querySelectorAll("source").forEach((s) => s.remove());
        video.removeAttribute("src");
        try { video.load(); } catch {}

        video.dataset.loaded = "0";
      });
    };

    const open = (key) => {
      // 🔥 si cambias de servicio, frena el anterior
      unloadVideosIn(modal);

      let activeItem = null;

      items.forEach((it) => {
        const active = it.dataset.service === key;
        it.classList.toggle("is-active", active);
        if (active) activeItem = it;
      });

      if (!activeItem) return;

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-lock");

      // 🔥 carga SOLO el video del item activo
      loadVideosIn(activeItem);
    };

    const close = () => {
      // 🔥 frena y libera videos al cerrar
      unloadVideosIn(modal);

      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-lock");
      items.forEach((it) => it.classList.remove("is-active"));
    };

    document.addEventListener("click", (e) => {
      const card = e.target.closest(".service-icon-card[data-service]");
      if (card) {
        e.preventDefault();
        open(card.dataset.service);
        return;
      }
      if (e.target.closest("[data-close]")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });

  } catch (err) {
    console.error(err);
  }
};

await initServiciosModal();





    /* =========================
    Ubicacion
     ========================= */  
  const ubicacionSlot = document.getElementById("ubicacion-slot");
  if (ubicacionSlot) {
    try {
      const res = await fetch("partials/ubicacion.html", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar ubicacion.html");
      ubicacionSlot.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      ubicacionSlot.innerHTML = `
        <div class="container">
          <p style="color: rgba(11,18,32,.7);">No se pudo cargar la ubicación.</p>
        </div>
      `;
    }
  }

    /* =========================
     Profesionales
     ========================= */
  const profesionalesSlot = document.getElementById("profesionales-slot");
  if (profesionalesSlot) {
    try {
      const res = await fetch("partials/profesionales.html", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar profesionales.html");
      profesionalesSlot.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      profesionalesSlot.innerHTML = `
        <div class="container">
          <p style="color: rgba(11,18,32,.7);">
            No se pudieron cargar los profesionales. Intentá recargar la página.
          </p>
        </div>
      `;
    }
  }

  /* =========================
   Slide Panel Pilates
   ========================= */

  const openPilatesPanel = async () => {
    const panel = document.getElementById("pilatesPanel");
    const content = document.getElementById("pilatesPanelContent");

    if (!panel || !content) return;

    // Cargar HTML si no está cargado
    if (!content.dataset.loaded) {
      try {
        const res = await fetch("partials/pilates.html", { cache: "no-store" });
        content.innerHTML = await res.text();
        content.dataset.loaded = "1";
      } catch {
        content.innerHTML = "<p>Error al cargar Pilates.</p>";
      }
    }

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // bloquear scroll fondo
  };

  const closePilatesPanel = () => {
    const panel = document.getElementById("pilatesPanel");
    if (!panel) return;

    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  /* Abrir desde badge Pilates */
  const pilatesBadgeLink = document.querySelector(".pilates-badge-link");
  if (pilatesBadgeLink) {
    pilatesBadgeLink.addEventListener("click", (e) => {
      e.preventDefault();
      openPilatesPanel();
    });
  }

  /* Cerrar */
  const closePilatesBtn = document.getElementById("closePilates");
  if (closePilatesBtn) {
    closePilatesBtn.addEventListener("click", closePilatesPanel);
  }

  /* =========================
   Botón "Pilates" del menú mobile
   ========================= */

  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-mobile-btn")) {
      openPilatesPanel();

      // cerrar menú hamburguesa
      const header = document.querySelector(".site-header");
      const toggle = document.querySelector(".menu-toggle");
      header?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      if (toggle) toggle.textContent = "☰";
    }
  });

    /* =========================
     Badge Pilates (aparece luego de X segundos)
     ========================= */
const pilatesBadge = document.getElementById("pilatesBadge");
const pilatesClose = document.getElementById("pilatesBadgeClose");

if (pilatesBadge) {
  setTimeout(() => {
    pilatesBadge.hidden = false;
    requestAnimationFrame(() => pilatesBadge.classList.add("is-show"));
  }, 5000);

  const dismiss = () => {
    pilatesBadge.classList.remove("is-show");
    setTimeout(() => (pilatesBadge.hidden = true), 250);
  };

  if (pilatesClose) pilatesClose.addEventListener("click", dismiss);
}
});
