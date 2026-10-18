/* MAIN.JS
   1 Data (ubah di sini) · 2 Util · 3 Render skills · 4 Render hobi
   5 Menu mobile · 6 Scrollspy · 7 Fade-up · 8 Lightbox · 9 Form */
"use strict";

/* 1. DATA — ganti nama file, caption, dan level (0-100) di sini */
const hobiFotos = [
  { src: "assets/images/hobi/images.jpg", caption: "Roadbike" },
  { src: "assets/images/hobi/Berenang1.png", caption: "Jalur sepi sebelum kota bangun." },
  { src: "assets/images/hobi/lari.jpg", caption: "Istirahat sebentar, kopi dari termos." },
  { src: "assets/images/hobi/gym.jpg", caption: "Bayangan panjang di jalan desa." },
  { src: "assets/images/hobi/reze.jpg", caption: "Rantai bersih, tujuan belum jelas." },
  { src: "assets/images/hobi/waguri.jpg", caption: "Pulang saat lampu jalan menyala." }
];

// Hobi lain? Tambahkan satu objek baru di array ini.
const hobi = [
  { 
    nama: "Bersepeda Berenang Lari Gym dan Nonton Anime",
    teks: "Akhir pekan saya dimulai sebelum matahari naik. Olahraga adalah cara saya menenagkan pikiran",
    foto: hobiFotos
  }
];

const skills = {
  Networking: [
    ["Routing & Switching", 85], ["VLAN", 80], ["Subnetting / IP Addressing", 90],
    ["OSPF / EIGRP", 75], ["Firewall", 70], ["VPN", 70],
    ["Cisco Packet Tracer", 90], ["Mikrotik", 75], ["Wireshark", 80]
  ],
  Cybersecurity: [
    ["Penetration Testing", 70], ["Vulnerability Assessment", 75], ["OWASP Top 10", 75],
    ["Kali Linux", 80], ["Nmap", 85], ["Burp Suite", 70],
    ["Network Hardening", 70], ["Incident Response", 60], ["Dasar SIEM", 55]
  ]
};

/* 2. UTIL */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (tag, attr = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const k in attr) e.setAttribute(k, attr[k]);
  e.append(...kids);
  return e;
};

/* 3. RENDER SKILLS */
const skillsRoot = $("#skills-root");
Object.entries(skills).forEach(([grup, items]) => {
  const ul = h("ul", { class: "sk" });
  items.forEach(([nama, level]) => {
    const fill = h("i");
    fill.style.setProperty("--v", level + "%");
    ul.append(h("li", {},
      h("div", { class: "row" }, h("span", {}, nama), h("span", { class: "pct" }, level + "%")),
      h("div", { class: "bar", "aria-hidden": "true" }, fill)
    ));
  });
  skillsRoot.append(h("div", { class: "grp" }, h("h3", {}, grup), ul));
});

/* 4. RENDER HOBI + GALERI */
const hobiRoot = $("#hobi-root");
hobi.forEach(hb => {
  const gal = h("div", { class: "gal" });
  hb.foto.forEach((f, i) => {
    const img = h("img", { src: f.src, alt: f.caption, loading: "lazy", width: "600", height: "450" });
    const btn = h("button", { type: "button", "aria-label": "Perbesar foto: " + f.caption }, img);
    btn.addEventListener("click", () => openLb(hb.foto, i, btn));
    gal.append(btn);
  });
  hobiRoot.append(h("article", { class: "hb" }, h("h3", {}, hb.nama), h("p", {}, hb.teks), gal));
});

/* 5. MENU MOBILE */
const side = $(".side"), burger = $(".burger");
const toggleMenu = force => {
  const open = typeof force === "boolean" ? force : !side.classList.contains("open");
  side.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
};
burger.addEventListener("click", () => toggleMenu());
$$("nav a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

/* 6. SCROLLSPY — menu menyala sesuai section di tengah layar */
const links = $$("nav a");
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(a => {
      const on = a.getAttribute("href") === "#" + en.target.id;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach(a => spy.observe($(a.getAttribute("href"))));

/* 7. FADE-UP SAAT SCROLL + bar skill terisi saat terlihat */
const reveal = new IntersectionObserver((entries, obs) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    obs.unobserve(en.target);
  });
}, { threshold: 0.1 });
$$(".hero-t, .sec > *, .grp").forEach(el => { el.classList.add("up"); reveal.observe(el); });

/* 8. LIGHTBOX */
const lb = $("#lb"), lbImg = $("img", lb), lbCap = $("figcaption", lb);
let set = [], cur = 0, opener = null;

function show(i) {
  cur = (i + set.length) % set.length;
  lbImg.src = set[cur].src;
  lbImg.alt = set[cur].caption;
  lbCap.textContent = set[cur].caption;
}
function openLb(list, i, from) {
  set = list; opener = from; show(i);
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => $(".lb-x").focus(), 50);
}
function closeLb() {
  if (!lb.classList.contains("open")) return;
  lb.classList.remove("open");
  document.body.style.overflow = "";
  if (opener) opener.focus();
}
$(".lb-x").addEventListener("click", closeLb);
$(".lb-p").addEventListener("click", () => show(cur - 1));
$(".lb-n").addEventListener("click", () => show(cur + 1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { toggleMenu(false); closeLb(); }
  if (!lb.classList.contains("open")) return;
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
  if (e.key === "Tab") { // fokus tetap berputar di dalam lightbox
    const b = $$("button", lb), first = b[0], last = b[b.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* 9. FORM KONTAK — validasi lalu buka aplikasi email */
$("#yr").textContent = new Date().getFullYear();
const form = $("#form"), okMsg = $(".ok");
const rules = {
  nama: v => v.trim().length >= 2 || "Tulis nama Anda, minimal 2 huruf.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Format email belum sesuai, contoh: nama@email.com.",
  pesan: v => v.trim().length >= 10 || "Pesan terlalu singkat, tulis minimal 10 karakter."
};
const check = el => {
  const r = rules[el.name](el.value);
  el.parentElement.querySelector(".err").textContent = r === true ? "" : r;
  el.setAttribute("aria-invalid", String(r !== true));
  return r === true;
};
form.addEventListener("input", e => {
  if (e.target.name in rules && e.target.getAttribute("aria-invalid") === "true") check(e.target);
});
form.addEventListener("submit", e => {
  e.preventDefault();
  okMsg.textContent = "";
  const valid = $$("[name]", form).map(check).every(Boolean);
  if (!valid) { $('[aria-invalid="true"]', form).focus(); return; }
  const to = $('.links a[href^="mailto:"]').getAttribute("href").slice(7);
  const d = Object.fromEntries(new FormData(form));
  const subject = encodeURIComponent("Pesan dari " + d.nama);
  const body = encodeURIComponent(d.pesan + "\n\n" + d.nama + " (" + d.email + ")");
  location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
  okMsg.textContent = "Terima kasih. Aplikasi email Anda akan terbuka dengan pesan ini.";
  form.reset();
});
