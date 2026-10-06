// ===== Datos de contacto: edita aquí =====
const CONFIG = {
  whatsapp: "570000000000", // código de país + número, sin "+" ni espacios
  email: "contacto@fulleventos.com",
  instagram: "https://instagram.com/fulleventos",
};

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  a.href = waLink("¡Hola Fulleventos! Quiero información para mi evento.");
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll("[data-phone-label]").forEach((a) => {
  a.textContent = "+" + CONFIG.whatsapp;
});
document.querySelectorAll("[data-email]").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
  a.textContent = CONFIG.email;
});
document.querySelectorAll("[data-instagram]").forEach((a) => {
  a.href = CONFIG.instagram;
  a.textContent = "@" + CONFIG.instagram.split("/").filter(Boolean).pop();
});

document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", false);
  })
);
window.addEventListener("scroll", () =>
  nav.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true }
);

// Animación al hacer scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".card, .event, .steps li, .gallery__item, .section h2")
  .forEach((el) => { el.classList.add("reveal"); io.observe(el); });

// Formulario -> WhatsApp
const form = document.getElementById("quote-form");
const error = form.querySelector(".form__error");
const today = new Date().toISOString().split("T")[0];
form.fecha.min = today;

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (!d.nombre.trim() || !d.tipo || !d.fecha) {
    error.hidden = false;
    return;
  }
  error.hidden = true;
  const lines = [
    "¡Hola Fulleventos! Quiero cotizar un evento:",
    `• Nombre: ${d.nombre.trim()}`,
    `• Tipo: ${d.tipo}`,
    `• Fecha: ${d.fecha}`,
    d.invitados && `• Invitados: ${d.invitados}`,
    d.lugar.trim() && `• Lugar: ${d.lugar.trim()}`,
    d.mensaje.trim() && `• Detalles: ${d.mensaje.trim()}`,
  ].filter(Boolean);
  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});
