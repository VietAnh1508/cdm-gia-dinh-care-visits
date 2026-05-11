# cdm-gia-dinh-care-visits

Volunteer delivery tracker for **Con Đức Mẹ Gia Định** — a community group in Ho Chi Minh City that delivers meals and gifts to people in need each month.

---

## Context

The group maintains a list of ~26 people ("thân chủ") across several neighbourhoods. Each month, a team of volunteers visits them one by one to deliver food and gifts. The list has historically been managed in a Google Sheet, which volunteers had to view on their phones while navigating — inconvenient for finding addresses, reading handwritten directions, and opening Maps.

This project replaces that workflow with a simple mobile-friendly web app.

**Primary users:** Vietnamese-speaking volunteers, on mobile, during an active delivery run.

---

## Decided solution

A **single self-contained HTML file** with no dependencies, no build step, and no backend.

Reasons for this choice:

- The list is updated monthly by a developer (editing a file and committing is acceptable)
- No auth, no concurrent editing, no real-time sync needed at this stage
- Works fully offline once loaded — important when navigating unfamiliar alleys
- Zero infrastructure cost and zero maintenance overhead
- Easy to share: send the file, open in browser, done

React + Supabase was considered and rejected as overkill for the current scope. Jekyll/static site generators were also considered but offer no advantage here since this is not a docs or blog site, and they would require a CMS layer the moment a non-technical user needs to edit the list.

---

## Current state

**File:** `index.html`

### Features

- List screen: all thân chủ grouped by person-in-charge (nhóm), with search and filter chips
- Detail screen: full address, directions hint ("gợi ý tìm nhà"), GPS coordinates, Google Maps deep-link
- Mark as done: tap ✓ on a card or toggle on the detail screen; dims the card and updates a progress bar
- Done state is **in-memory only** — resets on page reload (intentional for MVP; see roadmap)

### Data model

All data lives in a `PEOPLE` array at the top of the HTML file. Each person is one object:

```js
{
  id:      1,          // unique, never change once set
  group:   "Chú Phát", // người phụ trách — changing this string reassigns the person
  name:    "Cô Sen Vạn Kiếp",
  rice:    0,          // số phần cơm
  gift:    0,          // số phần quà
  address: "125/4/11D Vạn Kiếp",
  hint:    "...",      // gợi ý tìm nhà (optional)
  gps:     "https://maps.app.goo.gl/...", // accepts: Maps URL | DMS string | decimal coords
  note:    "...",      // ghi chú thêm (optional)
}
```

### How to update the list each month

1. Open `index.html` in a text editor
2. Find the `PEOPLE` array (~line 60)
3. Add, remove, or edit person objects
4. To move someone between groups: change the `group` field value — filters and section headers update automatically
5. Update the `MONTH` constant at the top of the script (e.g. `"Tháng 6 · 2025"`)
6. Commit and redistribute the file

---

## Improvement vision

### Phase 2 — Google Sheets as data source

The natural next step when non-technical team members need to update the list without touching code.

**How it works:**

- Data stays in a Google Sheet (the team already knows how to use it)
- The Sheet is published as CSV (`File → Share → Publish to web → CSV`)
- The HTML file fetches that CSV at load time and parses it into the same `PEOPLE` structure
- No backend, no database — still a static file, just with a live data source

**Migration effort:** roughly 2–3 hours. The rendering logic is unchanged; only the data-loading step changes from a hardcoded array to a `fetch()` + CSV parse.

**Rough implementation sketch:**

```js
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/.../pub?output=csv";

async function loadData() {
  const res = await fetch(SHEET_CSV_URL);
  const text = await res.text();
  return parseCSV(text); // map rows to PEOPLE object shape
}
```

Column order in the Sheet should match the object fields above. A header row is recommended.

**Consideration:** the published Sheet URL is publicly readable — acceptable for this use case since the data is not sensitive beyond names and addresses. If privacy becomes a concern, the next step would be a lightweight backend with auth (Supabase or similar).

### Phase 3 — Persistent done state (optional)

If volunteers want the "đã xong" state to survive a page reload or be shared across devices:

- **Simple option:** `localStorage` — persists per device, no backend needed
- **Shared option:** a small Supabase table keyed by `(month, person_id)` — allows the whole team to see collective progress in real time

### Phase 4 — Full CRUD (optional)

If the group wants to add/edit/remove thân chủ directly in the app without touching a spreadsheet or code file, a proper backend becomes justified at this point. Supabase (Postgres + auth + REST API) is a good fit and can be adopted incrementally alongside Phase 2.

---

## File structure

```
cdm-gia-dinh-care-visit/
├── README.md
└── index.html   # the entire app
```

---

## Design notes

- Mobile-first, tested at 375–480px viewport width
- Font: Be Vietnam Pro (loaded from Google Fonts — requires internet on first load; cached after)
- No external JS dependencies
- All inline SVG icons — no icon font dependency
- Colour palette intentionally warm and low-contrast to reduce eye strain during outdoor use
