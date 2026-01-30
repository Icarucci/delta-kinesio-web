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
    const minWidth = logosTrack.parentElement.offsetWidth * 2;

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
