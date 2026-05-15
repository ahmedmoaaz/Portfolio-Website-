const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const techUniverse = document.querySelector(".tech-universe");
const orbitSkills = Array.from(document.querySelectorAll(".orbit-skill"));
const shouldAnimateSkills = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setThemeToggleLabel = () => {
  const currentTheme = document.documentElement.dataset.theme || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  themeToggle?.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
};

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

setThemeToggleLabel();

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme || "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem("theme", nextTheme);
  } catch {
    // Theme still changes for the current visit if storage is unavailable.
  }
  setThemeToggleLabel();
});

const placeOrbitSkills = () => {
  if (!techUniverse || orbitSkills.length === 0) return;

  const rect = techUniverse.getBoundingClientRect();
  const baseX = rect.width / 2;
  const baseY = rect.height / 2;
  const globeCenterX = rect.width / 2;
  const globeCenterY = rect.height * 0.72;
  const radius = Math.min(rect.width * 0.35, 365);
  const flattenY = 0.72;
  const rotation = performance.now() * 0.00018;

  orbitSkills.forEach((skill) => {
    const lat = Number(skill.dataset.lat || 0) * Math.PI / 180;
    const lon = Number(skill.dataset.lon || 0) * Math.PI / 180 + rotation;
    const x3 = Math.cos(lat) * Math.sin(lon);
    const y3 = Math.sin(lat);
    const z3 = Math.cos(lat) * Math.cos(lon);
    const x = globeCenterX + x3 * radius;
    const y = globeCenterY - y3 * radius * flattenY;
    const depth = (z3 + 1) / 2;
    const scale = 0.72 + depth * 0.46;
    const opacity = 0.36 + depth * 0.64;

    skill.style.transform = `translate(-50%, -50%) translate3d(${x - baseX}px, ${y - baseY}px, 0) scale(${scale})`;
    skill.style.opacity = opacity.toFixed(2);
    skill.style.zIndex = String(Math.round(10 + depth * 40));
    skill.style.filter = depth < 0.28 ? "blur(0.4px)" : "none";
  });

  if (shouldAnimateSkills) {
    requestAnimationFrame(placeOrbitSkills);
  }
};

requestAnimationFrame(placeOrbitSkills);
