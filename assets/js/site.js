async function loadJSON(path){
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return await res.json();
}

function applyTheme(theme){
  const root = document.documentElement;
  const setVar = (k, v) => { if (v !== undefined && v !== null && v !== "") root.style.setProperty(k, v); };

  const colors = theme?.colors || {};
  const layout = theme?.layout || {};
  const pattern = theme?.pattern || {};

  setVar("--bg", colors.bg);
  setVar("--ink", colors.ink);
  setVar("--muted", colors.muted);
  setVar("--line", colors.line);
  setVar("--primary", colors.primary);
  setVar("--accent", colors.accent);
  setVar("--card-bg", colors.card_bg);
  setVar("--card-border", colors.card_border);

  if (typeof layout.content_width === "number") setVar("--max", layout.content_width + "px");
  if (typeof layout.radius === "number") setVar("--radius", layout.radius + "px");

  if (pattern.enabled === false) setVar("--patternOpacity", "0");
  else {
    if (typeof pattern.opacity === "number") setVar("--patternOpacity", String(pattern.opacity));
    if (pattern.dot) setVar("--patternDot", pattern.dot);
    if (typeof pattern.size === "number") setVar("--patternSize", pattern.size + "px");
  }
}

function mountNav(site){
  const nav = document.getElementById("siteMenu");
  if (!nav) return;

  const here = (location.pathname || "/").replace(/\/+$/, "") || "/";
  nav.innerHTML = "";

  (site?.nav || []).forEach((it) => {
    const a = document.createElement("a");
    a.href = it.href;
    a.textContent = it.label;
    const target = (it.href || "/").replace(/\/+$/, "") || "/";
    if (target === here) a.classList.add("active");
    nav.appendChild(a);
  });
}

function mountBrand(site){
  const titleEl = document.getElementById("brandTitle");
  const claimEl = document.getElementById("brandClaim");
  const logoEl = document.getElementById("brandLogo");
  if (titleEl) titleEl.textContent = site?.title || "Ortsgemeinschaft";
  if (claimEl) claimEl.textContent = site?.claim || "";
  if (logoEl && site?.logo) logoEl.src = site.logo;
  if (logoEl && !site?.logo) logoEl.style.display = "none";
}

function mountFooter(site){
  const f1 = document.getElementById("footerLine1");
  const f2 = document.getElementById("footerLine2");
  if (f1) f1.textContent = site?.footer?.line1 || "";
  if (f2) f2.textContent = site?.footer?.line2 || "";
}

function mountStart(start){
  const h1 = document.getElementById("homeH1");
  const intro = document.getElementById("homeIntro");
  const tiles = document.getElementById("homeTiles");
  if (h1) h1.textContent = start?.h1 || "";
  if (intro) intro.textContent = start?.intro || "";

  if (tiles){
    tiles.innerHTML = "";
    (start?.tiles || []).forEach((t) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${(t.title || "").toUpperCase()}</h3>
        <p>${t.text || ""}</p>
        <div style="margin-top:12px;">
          <a class="btn" href="${t.href || "#"}">Öffnen</a>
        </div>
      `;
      tiles.appendChild(card);
    });
  }
}

(async () => {
  try {
    const theme = await loadJSON("/assets/content/theme.json");
    applyTheme(theme);
  } catch {}

  let site = {};
  try { site = await loadJSON("/assets/content/site.json"); } catch {}
  mountBrand(site);
  mountNav(site);
  mountFooter(site);
})();
