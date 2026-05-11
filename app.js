/* ═══════════════════════════════════════════════════════
   DATA
   To update the list: edit the PEOPLE array below.
   Fields:
     id       – unique number, never change once set
     name     – full display name
     group    – group label (người phụ trách)
     rice     – số phần cơm (number)
     gift     – số phần quà (number)
     address  – địa chỉ
     hint     – gợi ý tìm nhà (optional)
     gps      – tọa độ hoặc link Google Maps (optional)
     note     – ghi chú thêm (optional)
     imgUrls  – danh sách ảnh nhà, Google Drive share links (optional)
               e.g. ["https://drive.google.com/file/d/FILE_ID/view"]
═══════════════════════════════════════════════════════ */

const PEOPLE = [
  // ── Chú Phát ──────────────────────────────────────
  { id: 1, group: "Chú Phát", name: "Cô Sen Vạn Kiếp", rice: 0, gift: 0, address: "125/4/11D Vạn Kiếp", hint: "Hẻm đối diện nhà thờ Phú Hiền", hint2: "", gps: "https://maps.app.goo.gl/xPTyeJyjsqF2HVuGA" },
  { id: 2, group: "Chú Phát", name: "Cô Hồng Phan Xích Long", rice: 1, gift: 1, address: "Kế bên 148B Hoa Đào Phú Nhuận", hint: "Kế bên 148B Hoa Đào Phú Nhuận", gps: "10°47'54.6\"N 106°41'03.2\"E" },
  { id: 3, group: "Chú Phát", name: "Cô Hoa Nở Thạch Thị Thanh", rice: 1, gift: 1, address: "Hẻm 46 Thạch Thị Thanh", hint: "Tới Ngã 4 nhỏ trong hẻm, rẽ phải đi theo đường luồng trong hẻm tới cuối đường nhà bên tay trái siêu mỏng.", gps: "10°47'26.0\"N 106°41'33.8\"E" },
  { id: 4, group: "Chú Phát", name: "Bà 10 Xiềm bán nhang", rice: 1, gift: 1, address: "39786 Nguyễn Phi Khanh", hint: "Cuối hẻm 12 Nguyễn Phi Khanh, Quận 1", gps: "10°47'31.6\"N 106°41'42.6\"E" },
  { id: 5, group: "Chú Phát", name: "Cô Hoa Bạch Hai Bà Trưng", rice: 1, gift: 1, address: "Kế bên 392/4 Hai Bà Trưng, p Tân Định, Q1", hint: "Kế bên 392/4 Hai Bà Trưng, Phường Tân Định Quận 1", gps: "10°47'27.9\"N 106°41'19.6\"E" },

  // ── Trúc ──────────────────────────────────────────
  { id: 6, group: "Trúc", name: "Sr Tuyết - Cô Diệu", rice: 3, gift: 1, address: "C107 Lý Văn Phức", hint: "Hẻm 33 Chung Cư Lý Văn Phức Quận 1. Nhờ Sơ Tuyết phát giùm: Chú Thành, Cô Diệu", gps: "https://maps.app.goo.gl/pAoDEsGJhg8VAPG66" },
  { id: 7, group: "Trúc", name: "Chú Hùng", rice: 1, gift: 1, address: "52/59A Nguyễn Hữu Cầu, p Tân Định, Q1", hint: "", note: "", imgUrls: ["https://drive.google.com/file/d/1AZ-jmugxReaUyNFqEaPbOc0ILgRHPUDm/view"] },
  { id: 8, group: "Trúc", name: "Bà Nhân ông Quán", rice: 2, gift: 1, address: "214-21 BIS D Nguyễn Văn Nguyễn", hint: "", gps: "10°47'31.7\"N 106°41'14.6\"E" },
  { id: 9, group: "Trúc", name: "Chú Thiện Nguyễn Văn Nguyễn", rice: 1, gift: 1, address: "214/21 Bis C Nguyễn Văn Nguyễn", hint: "Hẻm Ngã 3 Kế Bên Ông Nhân Bà Quán", gps: "10°47'31.6\"N 106°41'14.6\"E" },
  { id: 10, group: "Trúc", name: "3 chị em Nguyễn Thị Diệu", rice: 3, gift: 2, address: "Hẻm 7/9 Nguyễn Thị Diệu, Q3", hint: "", gps: "10°46'37.1\"N 106°41'23.3\"E" },

  // ── Hoàng, Hoa ─────────────────────────────────────
  { id: 11, group: "Hoàng, Hoa", name: "Cô Ân ve chai Bùi Đình Tuý", rice: 1, gift: 1, address: "217/7019 A Bùi Đình Tuý", hint: "", gps: "https://maps.app.goo.gl/dk54iW3sjH4NEsfe7" },
  { id: 12, group: "Hoàng, Hoa", name: "Ông Hai Quang Bùi Đình Tuý", rice: 2, gift: 1, address: "220/37 Bùi Đình Tuý", hint: "", gps: "https://maps.app.goo.gl/UNvbWEMTuEbuoEfZ9" },
  { id: 13, group: "Hoàng, Hoa", name: "Cô Cảnh cô Mai Bình Lợi", rice: 2, gift: 1, address: "Hẻm 184 Nguyễn Xí, hỏi bếp ăn từ thiện Anh Đức (sau khu chung cư)", hint: "Kế bên bếp ăn từ thiện Anh Đức, bên trái có con đường đi vô 1 đoạn quẹo trái, đi lên 1 đoạn nhìn bên tay phải có cái xe hủ tiếu quẹo vô đó đi 1 đoạn có cái bình chữa cháy màu đỏ quẹo trái rồi quẹo phải. Đi thẳng xuống (nhà bên tay phải có cái xe lăn gấp gọn để ngoài)", gps: "10°49'06.8002\" N 106°42'31.7999\" E" },
  { id: 14, group: "Hoàng, Hoa", name: "2 cô nhà thờ Cổ", rice: 0, gift: 2, address: "377 Lê Quang Định vô 100m bên tay Phải", hint: "Vô trong nhà thờ lên lầu. Quẹo Phải đi thẳng nhà cuối nhà cô Yến. Nhà sau lưng cầu thang nhà cô Bé", gps: "10°48'48.0528\" N 106°41'21.0984\" E" },
  { id: 15, group: "Hoàng, Hoa", name: "Cô Thậy chú Tiền", rice: 0, gift: 1, address: "Hẻm 207/51 Nguyễn Văn Đậu", hint: "Đi hẻm 207/51. nhà cửa sắt kéo màu trắng bên tay Phải, có tượng Đức Mẹ (đối diện số nhà 207/51/17A)", gps: "10°48'46.6906\" N 106°41'20.0854\" E", note: "", imgUrls: ["https://drive.google.com/file/d/1BT4y46REipzp-k5MEJFTSXBP7zK72doJ/view"] },

  // ── VA ────────────────────────────────────────────
  { id: 16, group: "VA", name: "Cô Xuân chú Long Bùi Hữu Nghĩa", rice: 2, gift: 1, address: "282/103/B1 Bùi Hữu Nghĩa", hint: "", gps: "10°48'01.1\"N 106°42'04.6\"E", note: "", imgUrls: ["https://drive.google.com/file/d/1s_W-1eiQM4bcf7E089dlID1iiaEs7Y9A/view"] },
  { id: 17, group: "VA", name: "Chị Ngọc Phan Văn Hân", rice: 0, gift: 1, address: "Cuối hẻm 234 Phan Văn Hân, Bình Thạnh", hint: "Cuối hẻm 234 Phan Văn Hân, đi vô con hẻm nhỏ, nhà bên tay trái, có cửa màu xanh lá cây", gps: "10.7953750, 106.7031160", note: "", imgUrls: ["https://drive.google.com/file/d/1K11Y-AgYV6mALYOxOZitb0132Q_Oo-NY/view"] },
  { id: 18, group: "VA", name: "Anh Huy", rice: 1, gift: 1, address: "180/98 Xô Viết Nghệ Tĩnh", hint: "Cuối hẻm 180 Xô Viết Nghệ Tĩnh", gps: "10.7972520, 106.7131520", note: "", imgUrls: ["https://drive.google.com/file/d/1PGJmxQnWSvjpiOe2SkYXHfr6B0hFLGmf/view"] },
  { id: 19, group: "VA", name: "Bà Hai (Khu nhà trọ Chú Nghĩa)", rice: 1, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },
  { id: 20, group: "VA", name: "Ông Lượng (Khu nhà trọ Chú Nghĩa)", rice: 1, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },
  { id: 21, group: "VA", name: "Bà Đới", rice: 1, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },
  { id: 22, group: "VA", name: "Bà Năm", rice: 1, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },
  { id: 23, group: "VA", name: "Ông Tùng bà Tùng", rice: 2, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },
  { id: 24, group: "VA", name: "Cô Nguyễn Ngọc Ấn", rice: 1, gift: 1, address: "57/75 Điện Biên Phủ", hint: "Khu nhà trọ Chú Nghĩa" },

  // ── Khác ───────────────────────────────────────────
  { id: 25, group: "", name: "Anh chú Phát + con dâu", rice: 2, gift: 2, address: "Cầu băng Ki (có người qua lấy)", hint: "Cô chú Nguyên alo cô Liên ra nhóm lấy" },
  { id: 26, group: "", name: "Chú Hùng An Sương", rice: 1, gift: 1, address: "101 Hà huy Giáp P Thạnh Lộc Q12", hint: "", gps: "Ngân hàng Nam Á", note: "SDT: 0909783346. Gọi chú tới lấy tuần có gạo" },
  { id: 27, group: "", name: "Cô Nguyên chú Phát (cựu thành viên nhóm)", rice: 0, gift: 1, address: "", hint: "" },
];

/* ═══════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════ */
const done = new Set();           // IDs marked done (in-memory)
let currentFilter = "Tất cả";
let searchQuery = "";
let currentId = null;

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
  // Decimal coords "10.79, 106.71"
  const dec = gps.match(/^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/);
  if (dec) return `https://maps.google.com/?q=${dec[1]},${dec[2]}`;
  // DMS  10°47'26.0"N 106°41'33.8"E
  const dms = gps.match(/([\d°'".\s]+[NS])\s+([\d°'".\s]+[EW])/i);
  if (dms) return `https://maps.google.com/?q=${encodeURIComponent(gps)}`;
  // Plain text address hint
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
   RENDER LIST
═══════════════════════════════════════════════════════ */
function renderFilters() {
  const row = document.getElementById("filter-row");
  const all = ["Tất cả", ...groups()];
  row.innerHTML = all.map(g =>
    `<button class="chip${g === currentFilter ? " active" : ""}" onclick="setFilter('${g}')">${g}</button>`
  ).join("");
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

  // Group them
  const byGroup = {};
  people.forEach(p => {
    const grp = p.group || "Khác";
    (byGroup[grp] = byGroup[grp] || []).push(p);
  });

  let html = "";
  let listIndex = 0;
  // Get group names, sorted with "Khác" at the end
  const groupNames = Object.keys(byGroup).sort((a, b) => {
    if (a === "Khác") return 1;
    if (b === "Khác") return -1;
    return 0;
  });

  groupNames.forEach(grp => {
    const members = byGroup[grp];
    html += `<div class="section-header"><span>Phụ trách: ${grp}</span><span>${members.length} người</span></div>`;
    members.forEach(p => {
      listIndex++;
      const isDone = done.has(p.id);
      const av = initials(p.name);
      let tags = "";
      if (p.rice > 0) tags += `<span class="tag">${p.rice} cơm</span>`;
      if (p.gift > 0) tags += `<span class="tag amber">${p.gift} quà</span>`;
      if (p.rice === 0 && p.gift === 0) tags += `<span class="tag purple">Không có</span>`;
      html += `
        <div class="person-card${isDone ? " done" : ""}" id="card-${p.id}">
          <div class="avatar" onclick="showDetail(${p.id})">${av}</div>
          <div class="person-info" onclick="showDetail(${p.id})">
            <div class="person-name">${listIndex}. ${p.name}</div>
            <div class="person-addr">${p.address}</div>
            <div class="person-meta">${tags}</div>
          </div>
          <button class="check-btn${isDone ? " done" : ""}" onclick="toggleDone(${p.id})" aria-label="Đánh dấu xong">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>`;
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
  const av = initials(p.name);
  const mapUrl = mapsUrl(p.gps);

  let tags = "";
  if (p.rice > 0) tags += `<span class="tag" style="font-size:12px;padding:3px 9px;">${p.rice} phần cơm</span>`;
  if (p.gift > 0) tags += `<span class="tag amber" style="font-size:12px;padding:3px 9px;">${p.gift} phần quà</span>`;
  if (p.rice === 0 && p.gift === 0) tags += `<span class="tag purple" style="font-size:12px;padding:3px 9px;">Không có</span>`;

  const mapBtn = mapUrl ? `
    <a class="map-btn" href="${mapUrl}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
      <span class="map-btn-text">Mở Google Maps</span>
      <svg viewBox="0 0 24 24" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>` : "";

  const hintRow = p.hint ? `
    <div class="detail-row">
      <div class="detail-row-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
      <div class="detail-row-content">
        <div class="detail-row-label">Gợi ý tìm nhà</div>
        <div class="detail-row-value">${p.hint}</div>
      </div>
    </div>` : "";

  const gpsRow = p.gps && !p.gps.startsWith("http") ? `
    <div class="detail-row">
      <div class="detail-row-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg></div>
      <div class="detail-row-content">
        <div class="detail-row-label">Tọa độ GPS</div>
        <div class="detail-row-value mono">${p.gps}</div>
      </div>
    </div>` : "";

  const imgSection = p.imgUrls && p.imgUrls.length ? `
    <div class="detail-section">
      <div class="img-gallery">
        ${p.imgUrls.map(url => {
    const src = driveImgUrl(url);
    return `<a href="${src}" target="_blank" rel="noopener"><img class="gallery-img" src="${src}" alt="Ảnh nhà" loading="lazy"></a>`;
  }).join("")}
      </div>
    </div>` : "";

  const noteRow = p.note ? `
    <div class="detail-row">
      <div class="detail-row-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
      <div class="detail-row-content">
        <div class="detail-row-label">Ghi chú / Ảnh</div>
        <div class="detail-row-value">${p.note}</div>
      </div>
    </div>` : "";

  document.getElementById("detail-body").innerHTML = `
    <div class="detail-hero">
      <div class="avatar-lg">${av}</div>
      <div class="detail-name">${p.name}</div>

      <div class="detail-tags">${tags}</div>
    </div>

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
    </div>

    <div class="note-banner">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div class="note-banner-text">Trạng thái "Đã xong" sẽ mất khi tải lại trang — chỉ dùng để theo dõi trong buổi đi thăm.</div>
    </div>

    ${mapBtn}

    <div class="detail-section">
      <div class="detail-card">
        <div class="detail-row">
          <div class="detail-row-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
          <div class="detail-row-content">
            <div class="detail-row-label">Địa chỉ</div>
            <div class="detail-row-value">${p.address}</div>
          </div>
        </div>
        ${hintRow}
        ${gpsRow}
        ${noteRow}
      </div>
    </div>

    ${imgSection}
  `;
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

  // Update card and check button
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.classList.toggle("done", isDone);
    const btn = card.querySelector(".check-btn");
    if (btn) btn.outerHTML = `<button class="check-btn${isDone ? " done" : ""}" onclick="toggleDone(${id})" aria-label="Đánh dấu xong"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></button>`;
  }
}

function toggleDoneDetail(id) {
  if (done.has(id)) done.delete(id); else done.add(id);
  const isDone = done.has(id);

  // Update detail toggle UI
  const doneCard = document.getElementById("done-card");
  const toggle = document.getElementById("detail-toggle");
  if (doneCard) doneCard.classList.toggle("active", isDone);
  if (toggle) toggle.classList.toggle("on", isDone);

  updateProgress();

  // Update list card in background
  const listCard = document.getElementById(`card-${id}`);
  if (listCard) {
    listCard.classList.toggle("done", isDone);
    const btn = listCard.querySelector(".check-btn");
    if (btn) btn.outerHTML = `<button class="check-btn${isDone ? " done" : ""}" onclick="toggleDone(${id})" aria-label="Đánh dấu xong"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></button>`;
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
   INIT
═══════════════════════════════════════════════════════ */
// document.getElementById("month-badge").textContent = MONTH;
renderFilters();
renderList();
