import { ChiaveSezione } from "../types";

export interface SidebarItem {
  section: ChiaveSezione;
  icon: string;
  label: string;
}

export interface SidebarGroup {
  groupLabel: string;
  items: SidebarItem[];
}

// Configurazione della sidebar per l’admin. Definisce le sezioni, icone e etichette.
export interface SidebarConfig {
  title: string;
  subtitle: string;
  groups: SidebarGroup[];
}

// Funzione per generare l'id del badge di conteggio nella sidebar in modo standardizzato.
// Da usare quando si aggiornano i conteggi.
export function getSidebarCountId(section: ChiaveSezione): string {
  return `cnt-${section}`;
}

// Configurazione della sidebar per l’admin. Definisce le sezioni, icone e etichette.
export const SIDEBAR_ADMIN_CONFIG: SidebarConfig = {
  title: "📋 Pannello Admin",
  subtitle: "Gestione contenuti",
  groups: [
    {
      groupLabel: "CONTENUTI",
      items: [
        { section: "articoli", icon: "📝", label: "Articoli" },
        { section: "commenti", icon: "💬", label: "Commenti" },
      ],
    },
    {
      groupLabel: "PERSONE",
      items: [
        { section: "utenti", icon: "👥", label: "Utenti" },
        { section: "ruoli", icon: "🎭", label: "Ruoli" },
      ],
    },
    {
      groupLabel: "CESTINO",
      items: [
        { section: "cestino-articoli", icon: "🗑️", label: "Articoli" },
        { section: "cestino-commenti", icon: "🗑️", label: "Commenti" },
        { section: "cestino-utenti", icon: "🗑️", label: "Utenti" },
        { section: "cestino-ruoli", icon: "🗑️", label: "Ruoli" },
      ],
    },
  ],
};

// Funzione per generare l'HTML della sidebar in base alla configurazione e alla sezione attiva.
// Per ogni gruppo, crea una sezione con etichetta e pulsanti. Ogni pulsante ha un badge per il conteggio, con id standard `cnt-${section}`.
export function renderSidebar(config: SidebarConfig, sezioneAttiva: ChiaveSezione): string {
  const htmlGruppi = config.groups
    .map(
      (gruppo) => `
    <div class="sidebar__group">
      <div class="sidebar__group-label">${gruppo.groupLabel}</div>
      ${gruppo.items
        .map((elemento) => {
          const countId = getSidebarCountId(elemento.section);
          return `
        <button class="sidebar__item ${elemento.section === sezioneAttiva ? "sidebar__item--active" : ""}"
          data-section="${elemento.section}">
          <span>${elemento.icon} ${elemento.label}</span>
          <span class="sidebar__count" id="${countId}">0</span>
        </button>`;
        })
        .join("")}
    </div>`
    )
    .join("");

  return `
    <aside class="sidebar">
      <div class="sidebar__header">
        <h2 class="sidebar__title">${config.title}</h2>
        <p class="sidebar__subtitle">${config.subtitle}</p>
      </div>
      ${htmlGruppi}
    </aside>`;
}

// Imposta l’evento di click sulla sidebar per gestire la navigazione.
// Quando un pulsante viene cliccato, chiama onNavigate con la sezione corrispondente.
export function setupSidebar(
  container: HTMLElement,
  sezioneCorrente: () => ChiaveSezione,
  onNavigate: (sezione: ChiaveSezione) => void
): void {
  container.addEventListener("click", (e) => {
    const pulsante = (e.target as HTMLElement).closest("[data-section]") as HTMLElement | null;
    if (!pulsante) return;

    const sezione = pulsante.dataset.section as ChiaveSezione | undefined;
    if (!sezione) return;

    if (sezione !== sezioneCorrente()) {
      onNavigate(sezione);
    }
  });
}

//aggiorna la classe active sui pulsanti della sidebar in base alla sezione attiva. Da chiamare dopo ogni navigazione.
export function aggiornaSidebarAttiva(sezioneAttiva: ChiaveSezione): void {
  document.querySelectorAll("[data-section]").forEach((pulsante) => {
    const el = pulsante as HTMLElement;
    el.classList.toggle("sidebar__item--active", el.dataset.section === sezioneAttiva);
  });
}

// Aggiorna i conteggi visualizzati nei badge della sidebar. Accetta un oggetto parziale con chiavi sezione e valori conteggio.
export function aggiornaConteggiSidebar(
  conteggi: Partial<Record<ChiaveSezione, number>>
): void {
  Object.entries(conteggi).forEach(([sezione, conteggio]) => {
    const id = getSidebarCountId(sezione as ChiaveSezione);
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = String(conteggio ?? 0);
  });
}

