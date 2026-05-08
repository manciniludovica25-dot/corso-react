/**
 * app.ts — Entry point
 * Detects the current page and boots the correct module.
 *
 * Convention:
 *   - /index.html  → public blog view  → pages/public/index.ts
 *   - /admin.html  → admin dashboard   → pages/admin/index.ts
 */

const path = window.location.pathname;

if (path.includes("admin")) {
  import("./pages/admin/index.js");
} else {
  import("./pages/public/index.js");
}