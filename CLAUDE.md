# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Volunteer delivery tracker for **Con Đức Mẹ Gia Định**, a community group in Ho Chi Minh City that delivers meals and gifts monthly to ~26 people ("thân chủ"). Primary users are Vietnamese-speaking volunteers on mobile during an active delivery run.

The no-backend approach is a deliberate design decision — not a gap to fill. React, Supabase, and static site generators were considered and rejected as overkill. The app works fully offline once loaded and has zero infrastructure cost.

## Running the app

The app is served (GitHub Pages or similar) — no build step, no dependencies. Open `index.html` via the server.

**File layout:**
- [index.html](index.html) — HTML shell only (no inline CSS or JS)
- [style.css](style.css) — all styles
- [app.js](app.js) — all data and logic

## Architecture

[app.js](app.js) is structured as:

1. **Data layer**: `PEOPLE` array of care-visit recipients. `MONTH` is a display constant updated each month.
2. **In-memory state**: `done` (a `Set` of visited IDs), `currentFilter`, `searchQuery`, `currentId`. State resets on page refresh — intentional for MVP, communicated via a warning banner.
3. **Two-screen UI**: `#screen-list` (filterable, searchable list grouped by caregiver) and `#screen-detail` (individual person card with map link and visit toggle). Navigation: `showList()` / `showDetail(id)`.
4. **Rendering**: `renderFilters()`, `renderList()`, `renderDetail()` write `innerHTML` directly.
5. **GPS utility** (`mapsUrl`): Accepts Google Maps share URLs, decimal `lat,lng`, or DMS strings and normalizes them to a Google Maps link.

### Data model

```js
{
  id:      1,             // unique; never change once set — used to track done state
  group:   "Chú Phát",   // caregiver name; changing this string reassigns the person
  name:    "Cô Sen Vạn Kiếp",
  rice:    0,             // số phần cơm
  gift:    0,             // số phần quà
  address: "125/4/11D Vạn Kiếp",
  hint:    "...",         // gợi ý tìm nhà (optional)
  gps:     "https://maps.app.goo.gl/...", // Maps URL | DMS string | decimal coords
  note:    "...",         // ghi chú thêm (optional)
}
```

### Monthly update workflow

1. Find the `PEOPLE` array at the top of [app.js](app.js)
2. Add, remove, or edit person objects (never reuse or change an existing `id`)
3. To reassign someone to a different caregiver, change their `group` string
4. Update the `MONTH` constant (e.g. `"Tháng 6 · 2025"`)
5. Commit and redeploy

## Planned next step (Phase 2)

Replace the hardcoded `PEOPLE` array with a `fetch()` of a Google-Sheets-published CSV — same rendering logic, live data source, still no backend. See README.md for the implementation sketch.

## Conventions

- All UI labels and data values are in Vietnamese.
- Mobile-first, capped at 480 px width, no media queries.
- CSS custom properties (`--teal`, `--amber`, `--purple`) for tag colors.
- ARIA labels on interactive elements — preserve when editing UI.
