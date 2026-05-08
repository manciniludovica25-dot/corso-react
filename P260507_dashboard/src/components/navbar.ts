export interface NavItem {
  href: string;
  label: string;
  isActive?: boolean;
}

// Genera l'HTML della barra di navigazione (navbar).
export function renderNavbar(items: NavItem[], brand = "Blog"): string {
  const links = items
    .map(
      (item) =>
        `<a href="${item.href}" class="navbar__link ${item.isActive ? "navbar__link--active" : ""}">${item.label}</a>`
    )
    .join("");

  return `
    <nav class="navbar">
      <span class="navbar__brand">${brand}</span>
      <div class="navbar__links">${links}</div>
    </nav>`;
}