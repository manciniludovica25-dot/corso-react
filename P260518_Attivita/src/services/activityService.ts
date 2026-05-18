import type { Activity } from "../types/Activity.types";

import type {
    PaginatedResponse,
    PaginationParams,
} from "../types/Pagination.types";

const ALL_ACTIVITIES: Activity[] = [
    {
        id: 1,
        name: "Andare a lavoro",
        description:
            "Andare in ufficio dalle 9 alle 18.",
        isCompleted: true,
    },
    {
        id: 2,
        name: "Fare la spesa",
        description:
            "Andare a comprare il pane e il latte.",
        isCompleted: true,
    },
    {
        id: 3,
        name: "Preparare la cena",
        description:
            "Cucinare la pasta al pomodoro.",
        isCompleted: false,
    },
    {
        id: 4,
        name: "Andare in palestra",
        description: "Allenarsi per 1 ora.",
        isCompleted: false,
    },
    {
        id: 5,
        name: "Studiare React",
        description:
            "Ripassare useState e useEffect.",
        isCompleted: true,
    },
    {
        id: 6,
        name: "Portare fuori il cane",
        description:
            "Fare una passeggiata di 30 minuti.",
        isCompleted: false,
    },
    {
        id: 7,
        name: "Leggere un libro",
        description:
            "Leggere almeno 20 pagine.",
        isCompleted: true,
    },
    {
        id: 8,
        name: "Pulire casa",
        description:
            "Passare aspirapolvere e lavare il pavimento.",
        isCompleted: false,
    },
    {
        id: 9,
        name: "Fare la lavatrice",
        description:
            "Lavare vestiti bianchi e colorati.",
        isCompleted: true,
    },
    {
        id: 10,
        name: "Chiamare il medico",
        description:
            "Prenotare una visita di controllo.",
        isCompleted: false,
    },
];

//simula un ritardo di rete della durata di 1-3 secondi
const simulateDelay = (): Promise<void> =>
    new Promise(resolve => {
        const ms = 1000 + Math.random() * 2000;

        setTimeout(resolve, ms);
    });

// fetch delle attività con filtri e paginazione. il filtro viene applicato prima della paginazione, quindi il numero tot di pagine dipende dal filtro selezionato.
export async function fetchActivities(
    params: PaginationParams,
): Promise<PaginatedResponse<Activity>> {
    await simulateDelay();

    const filtered = ALL_ACTIVITIES.filter(
        activity => {
            switch (params.filter) {
                case "completed":
                    return activity.isCompleted;

                case "notCompleted":
                    return !activity.isCompleted;

                case "all":
                default:
                    return true;
            }
        },
    );

    const totalItems = filtered.length;

    const totalPages = Math.ceil(
        totalItems / params.itemsPerPage,
    );

    const safePage = Math.min(
        params.page,
        Math.max(totalPages, 1),
    );

    const start =
        (safePage - 1) * params.itemsPerPage;

    const items = filtered.slice(
        start,
        start + params.itemsPerPage,
    );

    return {
        items,
        totalItems,
        totalPages,
        currentPage: safePage,
    };
}

// Cambia lo stato di completamento di un'attività.
// Aggiorna l'array in memoria simulando un aggiornamento lato server.
export async function toggleActivityCompleted(
    id: number,
): Promise<void> {
    await simulateDelay();

    const activity = ALL_ACTIVITIES.find(
        currentActivity => currentActivity.id === id,
    );

    if (!activity) {
        throw new Error("Attività non trovata.");
    }

    activity.isCompleted = !activity.isCompleted;
}