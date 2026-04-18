# Report Modal Backend Integration — Design Spec

## Overview

Upgrade the existing `ReportModal` from a mock-data flow to a fully integrated experience with real AI image verification, interactive map-based location picking, and backend report creation via the Spring Boot report-module.

## Step Flow (Reordered)

The 3-step wizard is reordered to front-load the AI blocking check so users don't waste time filling out details for a photo that won't pass verification.

### Step 1 — Photo Upload + AI Verification

- Reuses the existing drop-zone UI from the old Step 2
- On file selection, immediately call `aiApi.verifyImage(formData)` with the image
- Display states on the AI check widget:
  - **Loading:** "Analyzing image..." with spinner
  - **Trash detected:** Green confirmation with confidence score (e.g. "95% — Trash detected"). "NEXT" button enabled
  - **Not trash:** Red error block: "AI did not detect trash in this image. Please upload a different photo." "NEXT" button stays disabled. User can re-upload a different photo
- Store the actual `File` object in form state (not just the blob URL) for later submission
- No GPS info in this step

### Step 2 — Full-Screen Map Picker

- When advancing to Step 2, the modal transitions to a full-screen map overlay
- The modal sheet animates out, replaced by a full-screen MapLibre map (same dark CartoCDN style: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`)
- Floating instruction bar at top: "Tap on the map to place your report" with crosshair icon
- User clicks on the map — a pin drops using the same SVG marker style from `MapContainer`
- Clicking again repositions the pin (only one pin at a time)
- Floating bottom card shows:
  - Selected coordinates (lat, lng formatted)
  - "CANCEL" ghost button — returns to Step 1, no location saved
  - "CONFIRM LOCATION" primary button — saves lat/lng, transitions back to modal for Step 3
- Confirm button disabled until a pin is placed
- Map initializes centered on Sofia: `[23.3219, 42.6977]`, zoom 12
- Clean map — no sidebar, no existing report markers

### Step 3 — Details + Review + Submit

Combines the old Step 1 (description/severity) with old Step 3 (review):

- **Top preview strip:** Photo thumbnail + selected coordinates (lat, lng)
- **Description textarea:** "Describe the pollution..."
- **Severity grid:** 4 buttons — Critical / Serious / Medium / Low (same as current)
- **AI verification badge:** Shows stored AI result (confidence %, "Trash confirmed")
- **Submit button:** "SEND REPORT"

**Submit flow:**
1. Build `FormData` with: image `File`, `latitude`, `longitude`, `description`, `severity`
2. Call `reportsApi.create(formData)` — hits `POST /api/reports`
3. Show loading spinner on button
4. **On success:** Backend returns `ReportResponse` with new report ID, coords, status. Dispatch `ADD_REPORT` to AppContext with real backend data so it appears on the map. Show existing success screen with points.
5. **On error:** Show error box above submit button, keep form editable

## Backend Changes

### `CreateReportRequest.java`
- Add `String severity` field

### `Report.java` (entity)
- Add `String severity` column

### `ReportResponse.java` (DTO)
- Add `severity` field

### `ReportController.java`
- Change `createReport` to accept `multipart/form-data`:
  - `@RequestPart("image") MultipartFile image`
  - `@RequestPart("latitude") String latitude`
  - `@RequestPart("longitude") String longitude`
  - `@RequestPart("description") String description`
  - `@RequestPart("severity") String severity`
- The `X-User-Id` header remains for user identification

### `ReportService.java`
- Update `createReport` to handle the `MultipartFile`:
  - Store file to local filesystem under a configurable uploads directory (e.g. `uploads/reports/`)
  - Generate a UUID-based filename to avoid collisions
  - Save the relative path as `photoUrl` on the `Report` entity
  - Map severity from the request

## Frontend Changes

### `ReportModal.tsx`
- Rewrite step components: Step1 = photo + AI, Step2 = full-screen map, Step3 = details + submit
- Import and call `aiApi.verifyImage()` and `reportsApi.create()`
- Store `File` object, AI result, and lat/lng in form state
- Full-screen map overlay as a separate rendering mode (not inside the modal sheet)

### `ReportModal.css`
- Full-screen map overlay styles (position fixed, inset 0, z-index above modal)
- Floating instruction bar (top, centered, glass-morphism style)
- Floating bottom card (coordinates display + buttons)
- AI loading, success, and error state styles

### `AppContext.tsx`
- Update `ADD_REPORT` reducer case to accept backend `ReportResponse` shape
- Map `latitude`/`longitude` to `gps: { lat, lng }` for compatibility with `MapContainer`

### `i18n.ts`
- Add translation keys for: map picker instructions, AI verification states, coordinate display labels

## Files NOT Changed

- `api.ts` — Already has `reportsApi.create(formData)` and `aiApi.verifyImage(fd)` sending FormData correctly
- `MapContainer.tsx` — Untouched; new reports appear via AppContext state
- No new files created — all modifications to existing files
