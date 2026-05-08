export function renderHeader(titolo: string, sottotitolo?: string): string {
  return `
    <header class="site-header">
      <div class="site-header__inner">
        <h1 class="site-header__title">${titolo}</h1>
        ${sottotitolo ? `<p class="site-header__subtitle">${sottotitolo}</p>` : ""}
      </div>
    </header>`;
}