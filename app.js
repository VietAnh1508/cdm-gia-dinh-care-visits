/* ═══════════════════════════════════════════════════════
   DATA SOURCES
   Primary:  Google Sheet published as CSV (SHEET_CSV_URL)
   Fallback: static-data.csv in the project root
             — update by exporting from the app UI when the
               sheet changes, then commit the file.
═══════════════════════════════════════════════════════ */

let PEOPLE = [];
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQu5sBVsO0qM2AN6qXC-WUlqDgDBXzrFeR3f2J9z2kGH8rWJvxWrSOGMT9c7YZNBLCdSV-TobYilnS2/pub?gid=1942507551&single=true&output=csv";

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
const done = new Set();
let currentFilter = "Tất cả";
let searchQuery = "";
let currentId = null;

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const ICON_CHECK = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_INFO = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
const ICON_PIN = `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const ICON_MAP = `<svg viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`;
const ICON_EXTERNAL = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const ICON_GPS = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`;
const ICON_NOTE = `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

/* ═══════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════ */
function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mapsUrl(gps) {
  if (!gps) return null;
  if (gps.startsWith("http")) return gps;
  const dec = gps.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
  if (dec) return `https://maps.google.com/?q=${dec[1]},${dec[2]}`;
  const dms = gps.match(/([\d°'".\s]+[NS])\s+([\d°'".\s]+[EW])/i);
  if (dms) return `https://maps.google.com/?q=${encodeURIComponent(gps)}`;
  return `https://maps.google.com/?q=${encodeURIComponent(gps)}`;
}

function driveImgUrl(url) {
  const m = url.match(/\/file\/d\/([^/?]+)/);
  return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800` : url;
}

function groups() {
  const seen = [];
  PEOPLE.forEach(p => { if (p.group && !seen.includes(p.group)) seen.push(p.group); });
  if (PEOPLE.some(p => !p.group)) seen.push("Khác");
  return seen;
}

function filtered() {
  return PEOPLE.filter(p => {
    const pGroup = p.group || "Khác";
    const matchGroup = currentFilter === "Tất cả" || pGroup === currentFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    return matchGroup && matchSearch;
  });
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS — TAGS
═══════════════════════════════════════════════════════ */
function tag(text, color) {
  return `<span class="tag${color ? ` ${color}` : ``}">${text}</span>`;
}

function personTags(p) {
  if (p.rice === 0 && p.gift === 0) return tag("Không có", "purple");
  return (p.rice > 0 ? tag(`${p.rice} cơm`, "") : "") +
    (p.gift > 0 ? tag(`${p.gift} quà`, "amber") : "");
}

function sectionTotalsTags(totalRice, totalGift) {
  return (totalRice > 0 ? tag(`${totalRice} cơm`, "") : "") +
    (totalGift > 0 ? tag(`${totalGift} quà`, "amber") : "");
}

function detailTags(p) {
  const s = `style="font-size:12px;padding:3px 9px;"`;
  if (p.rice === 0 && p.gift === 0) return `<span class="tag purple" ${s}>Không có</span>`;
  return (p.rice > 0 ? `<span class="tag" ${s}>${p.rice} phần cơm</span>` : "") +
    (p.gift > 0 ? `<span class="tag amber" ${s}>${p.gift} phần quà</span>` : "");
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS — CHECK BUTTON
═══════════════════════════════════════════════════════ */
function checkButton(id, isDone) {
  return `<button class="check-btn${isDone ? " done" : ""}" onclick="toggleDone(${id})" aria-label="Đánh dấu xong">${ICON_CHECK}</button>`;
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS — LIST SCREEN
═══════════════════════════════════════════════════════ */
function chip(label, active) {
  return `<button class="chip${active ? " active" : ""}" onclick="setFilter('${label}')">${label}</button>`;
}

function sectionHeader(grp, members) {
  const totalRice = members.reduce((s, p) => s + (p.rice || 0), 0);
  const totalGift = members.reduce((s, p) => s + (p.gift || 0), 0);
  return `<div class="section-header"><span>Phụ trách: ${grp}</span><span class="section-header-right">${sectionTotalsTags(totalRice, totalGift)}<span>${members.length} nhà</span></span></div>`;
}

function personCard(p, index, isDone) {
  return `
    <div class="person-card${isDone ? " done" : ""}" id="card-${p.id}">
      <div class="avatar" onclick="showDetail(${p.id})">${initials(p.name)}</div>
      <div class="person-info" onclick="showDetail(${p.id})">
        <div class="person-name">${index}. ${p.name}</div>
        <div class="person-addr">${p.address}</div>
        <div class="person-meta">${personTags(p)}</div>
      </div>
      ${checkButton(p.id, isDone)}
    </div>`;
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS — DETAIL SCREEN
═══════════════════════════════════════════════════════ */
function detailRow(icon, label, value, opts = {}) {
  const cls = `detail-row-value${opts.mono ? " mono" : ""}`;
  return `
    <div class="detail-row">
      <div class="detail-row-icon">${icon}</div>
      <div class="detail-row-content">
        <div class="detail-row-label">${label}</div>
        <div class="${cls}">${value}</div>
      </div>
    </div>`;
}

function detailHero(p) {
  return `
    <div class="detail-hero">
      <div class="avatar-lg">${initials(p.name)}</div>
      <div class="detail-name">${p.name}</div>
      <div class="detail-tags">${detailTags(p)}</div>
    </div>`;
}

function doneSection(p, isDone) {
  return `
    <div class="done-section">
      <div class="done-card${isDone ? " active" : ""}" id="done-card" onclick="toggleDoneDetail(${p.id})">
        <div>
          <div class="done-card-label">Đã giao xong</div>
          <div class="done-card-sub">Chỉ lưu trong phiên này</div>
        </div>
        <div class="toggle${isDone ? " on" : ""}" id="detail-toggle">
          <div class="toggle-knob"></div>
        </div>
      </div>
    </div>`;
}

function noteBanner() {
  return `
    <div class="note-banner">
      ${ICON_INFO}
      <div class="note-banner-text">Trạng thái "Đã xong" sẽ mất khi tải lại trang — chỉ dùng để theo dõi trong buổi đi thăm.</div>
    </div>`;
}

function mapButton(url) {
  if (!url) return "";
  return `
    <a class="map-btn" href="${url}" target="_blank" rel="noopener">
      ${ICON_MAP}
      <span class="map-btn-text">Mở Google Maps</span>
      ${ICON_EXTERNAL}
    </a>`;
}

function imageGallery(urls) {
  if (!urls || !urls.length) return "";
  const imgs = urls.map(url => {
    const src = driveImgUrl(url);
    return `<a href="${src}" target="_blank" rel="noopener"><img class="gallery-img" src="${src}" alt="Ảnh nhà" loading="lazy"></a>`;
  }).join("");
  return `<div class="detail-section"><div class="img-gallery">${imgs}</div></div>`;
}

/* ═══════════════════════════════════════════════════════
   RENDER LIST
═══════════════════════════════════════════════════════ */
function renderFilters() {
  const row = document.getElementById("filter-row");
  const all = ["Tất cả", ...groups()];
  row.innerHTML = all.map(g => chip(g, g === currentFilter)).join("");
}

function updateProgress() {
  const people = filtered();
  const total = people.length;
  const doneN = people.filter(p => done.has(p.id)).length;
  const pct = total ? Math.round(doneN / total * 100) : 0;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent = `${doneN} / ${total} xong`;
}

function renderList() {
  const body = document.getElementById("list-body");
  const empty = document.getElementById("empty-state");
  const people = filtered();

  updateProgress();

  if (people.length === 0) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  const byGroup = {};
  people.forEach(p => {
    const grp = p.group || "Khác";
    (byGroup[grp] = byGroup[grp] || []).push(p);
  });

  const groupNames = Object.keys(byGroup).sort((a, b) => {
    if (a === "Khác") return 1;
    if (b === "Khác") return -1;
    return 0;
  });

  let listIndex = 0;
  let html = "";
  groupNames.forEach(grp => {
    html += sectionHeader(grp, byGroup[grp]);
    byGroup[grp].forEach(p => {
      listIndex++;
      html += personCard(p, listIndex, done.has(p.id));
    });
  });

  body.innerHTML = html;
}

/* ═══════════════════════════════════════════════════════
   RENDER DETAIL
═══════════════════════════════════════════════════════ */
function renderDetail(id) {
  const p = PEOPLE.find(x => x.id === id);
  if (!p) return;
  const isDone = done.has(p.id);
  const mapUrl = mapsUrl(p.gps);

  document.getElementById("detail-body").innerHTML =
    detailHero(p) +
    doneSection(p, isDone) +
    noteBanner() +
    mapButton(mapUrl) +
    `<div class="detail-section"><div class="detail-card">` +
    detailRow(ICON_PIN, "Địa chỉ", p.address) +
    (p.hint ? detailRow(ICON_INFO, "Gợi ý tìm nhà", p.hint) : "") +
    (p.gps && !p.gps.startsWith("http") ? detailRow(ICON_GPS, "Tọa độ GPS", p.gps, { mono: true }) : "") +
    (p.note ? detailRow(ICON_NOTE, "Ghi chú / Ảnh", p.note) : "") +
    `</div></div>` +
    imageGallery(p.imgUrls);
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════ */
function showList() {
  document.getElementById("screen-list").classList.add("active");
  document.getElementById("screen-detail").classList.remove("active");
  renderList();
  window.scrollTo(0, 0);
}

function showDetail(id) {
  currentId = id;
  document.getElementById("screen-list").classList.remove("active");
  document.getElementById("screen-detail").classList.add("active");
  renderDetail(id);
  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════════════════
   ACTIONS
═══════════════════════════════════════════════════════ */
function toggleDone(id) {
  if (done.has(id)) done.delete(id); else done.add(id);
  const isDone = done.has(id);

  updateProgress();

  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.toggle("done", isDone);
    const btn = card.querySelector(".check-btn");
    if (btn) btn.outerHTML = checkButton(id, isDone);
  }
}

function toggleDoneDetail(id) {
  if (done.has(id)) done.delete(id); else done.add(id);
  const isDone = done.has(id);

  const doneCard = document.getElementById("done-card");
  const toggle = document.getElementById("detail-toggle");
  if (doneCard) doneCard.classList.toggle("active", isDone);
  if (toggle) toggle.classList.toggle("on", isDone);

  updateProgress();

  const listCard = document.getElementById(`card-${id}`);
  if (listCard) {
    listCard.classList.toggle("done", isDone);
    const btn = listCard.querySelector(".check-btn");
    if (btn) btn.outerHTML = checkButton(id, isDone);
  }
}

function setFilter(g) {
  currentFilter = g;
  renderFilters();
  renderList();
}

/* ═══════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════ */
document.getElementById("search-input").addEventListener("input", function () {
  searchQuery = this.value;
  renderList();
});

/* ═══════════════════════════════════════════════════════
   DATA LOADING
═══════════════════════════════════════════════════════ */
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  const rows = [];
  let row = [], i = 0;
  while (i < text.length) {
    if (text[i] === '"') {
      let f = ''; i++;
      while (i < text.length) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') { f += '"'; i += 2; }
          else { i++; break; }
        } else { f += text[i++]; }
      }
      row.push(f);
      if (text[i] === ',') { i++; }
      else if (text[i] === '\r') { i++; if (text[i] === '\n') i++; rows.push(row); row = []; }
      else if (text[i] === '\n') { i++; rows.push(row); row = []; }
    } else {
      let f = '';
      while (i < text.length && text[i] !== ',' && text[i] !== '\r' && text[i] !== '\n') f += text[i++];
      row.push(f);
      if (text[i] === ',') { i++; }
      else if (text[i] === '\r') { i++; if (text[i] === '\n') i++; rows.push(row); row = []; }
      else if (text[i] === '\n') { i++; rows.push(row); row = []; }
    }
  }
  if (row.length) rows.push(row);
  if (rows.length < 2) return [];

  const COL_MAP = {
    "Người phụ trách": "group",
    "STT": "id",
    "Tên thân chủ": "name",
    "Số phần cơm": "rice",
    "Số phần quà": "gift",
    "Định vị GPS": "gps",
    "Địa chỉ": "address",
    "Gợi ý tìm nhà": "hint",
    "Hình ảnh": "imgUrls",
  };
  const headers = rows[0].map(h => h.trim());
  const idx = {};
  headers.forEach((h, j) => { if (COL_MAP[h]) idx[COL_MAP[h]] = j; });
  const get = (r, field) => idx[field] !== undefined ? (r[idx[field]] || '').trim() : '';

  let lastGroup = '';
  const people = [];
  for (let r = 1; r < rows.length; r++) {
    const rawGroup = get(rows[r], 'group');
    if (rawGroup) {
      lastGroup = rawGroup.split('\n').map(l => l.trim())
        .find(l => l && !l.startsWith('http') && !l.startsWith('Tổng')) || lastGroup;
    }
    const id = parseInt(get(rows[r], 'id'), 10);
    if (!id || id <= 0) continue;
    const imgRaw = get(rows[r], 'imgUrls');
    const imgUrls = imgRaw ? imgRaw.split('|').map(u => u.trim()).filter(Boolean) : [];
    const person = {
      id,
      group: lastGroup,
      name: get(rows[r], 'name'),
      rice: parseInt(get(rows[r], 'rice'), 10) || 0,
      gift: parseInt(get(rows[r], 'gift'), 10) || 0,
      gps: get(rows[r], 'gps'),
      address: get(rows[r], 'address'),
      hint: get(rows[r], 'hint'),
    };
    if (imgUrls.length) person.imgUrls = imgUrls;
    people.push(person);
  }
  return people;
}

async function loadPeople() {
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(res.status);
  return parseCSV(await res.text());
}

async function loadStaticCSV() {
  const res = await fetch("./static-data.csv");
  if (!res.ok) throw new Error(res.status);
  return parseCSV(await res.text());
}

function showLoading(on) {
  document.getElementById("loading").hidden = !on;
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
(async () => {
  showLoading(true);
  try {
    PEOPLE = await loadPeople();
  } catch {
    PEOPLE = await loadStaticCSV();
  }
  showLoading(false);
  renderFilters();
  renderList();
})();
