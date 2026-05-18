import { useEffect, useState } from "react";

import ActivityRow from "./ActivityRow";
import Pagination from "./Pagination";

import { fetchActivities } from "../services/activityService";

import type { Activity } from "../types/Activity.types";
import type { FilterType } from "../types/Pagination.types";

type Props = {
    selectedId: number | null;
    setSelectedId: React.Dispatch<
        React.SetStateAction<number | null>
    >;
    onToggleCompleted: (id: number) => void;
};


//component che si occupa di mostrare la lista delle attività, con filtri e impaginazione. Gesrisce lo stato di caricamento, errori e empty state.
function ActivityList({
    selectedId,
    setSelectedId,
    onToggleCompleted,
}: Readonly<Props>) {
    const [activities, setActivities] = useState<Activity[]>([]);

    const [errorMessage, setErrorMessage] =
        useState<string | null>(null);

    const [isLoading, setIsLoading] =
        useState(false);

    const [filter, setFilter] =
        useState<FilterType>("all");

    const [page, setPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] =
        useState(4);

    const [totalPages, setTotalPages] =
        useState(1);

    const getFilterLabel = (
        filterType: FilterType,
    ): string => {
        switch (filterType) {
            case "all":
                return "Tutte";

            case "completed":
                return "Completate";

            case "notCompleted":
                return "Non completate";

            default:
                return "";
        }
    };

    // Fetch delle attività ogni volta che cambiano pagina, filtro o numero di elementi per pagina.
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                setErrorMessage(null);

                const response =
                    await fetchActivities({
                        page,
                        itemsPerPage,
                        filter,
                    });

                setActivities(response.items);

                setTotalPages(
                    response.totalPages,
                );
            } catch (err: unknown) {
                setErrorMessage(
                    err instanceof Error
                        ? err.message
                        : "Errore sconosciuto.",
                );
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [page, itemsPerPage, filter]);

    const handleFilterChange = (
        newFilter: FilterType,
    ) => {
        setFilter(newFilter);

        setPage(1);
    };

    const handlePageChange = (
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleItemsPerPageChange = (
        newItemsPerPage: number,
    ) => {
        setItemsPerPage(newItemsPerPage);

        setPage(1);
    };

    const handleLocalToggleCompleted = (
        id: number,
    ) => {
        setActivities(prevActivities =>
            prevActivities.map(activity =>
                activity.id === id
                    ? {
                          ...activity,
                          isCompleted:
                              !activity.isCompleted,
                      }
                    : activity,
            ),
        );

        onToggleCompleted(id);
    };

    const isEmpty =
        !isLoading &&
        !errorMessage &&
        activities.length === 0;

    const hasActivities =
        !isLoading &&
        !errorMessage &&
        activities.length > 0;

    return (
        <div className="activity-list">
            <div className="activity-list__filters">
                {(
                    [
                        "all",
                        "completed",
                        "notCompleted",
                    ] as FilterType[]
                ).map(filterTask => (
                    <button
                        key={filterTask}
                        className={`activity-list__filter-btn${
                            filter === filterTask
                                ? " activity-list__filter-btn--active"
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterChange(
                                filterTask,
                            )
                        }
                        disabled={isLoading}
                    >
                        {getFilterLabel(
                            filterTask,
                        )}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="activity-list__feedback activity-list__feedback--loading">
                    <div
                        className="activity-list__spinner"
                        aria-hidden="true"
                    />

                    <p>Caricamento attività…</p>
                </div>
            )}

            {errorMessage && (
                <div className="activity-list__feedback activity-list__feedback--error">
                    <p>⚠️ {errorMessage}</p>

                    <button
                        className="activity-list__retry-btn"
                        onClick={() => {
                            setErrorMessage(null);

                            setIsLoading(true);

                            setTimeout(() => {
                                setIsLoading(false);
                            }, 300);
                        }}
                    >
                        Riprova
                    </button>
                </div>
            )}

            {isEmpty && (
                <div className="activity-list__feedback activity-list__feedback--empty">
                    <p>
                        Nessuna attività trovata per
                        il filtro selezionato.
                    </p>
                </div>
            )}

            {hasActivities && (
                <>
                    <div className="activity-list__grid">
                        {activities.map(
                            activity => (
                                <ActivityRow
                                    key={
                                        activity.id
                                    }
                                    activity={
                                        activity
                                    }
                                    selectedId={
                                        selectedId
                                    }
                                    setSelectedId={
                                        setSelectedId
                                    }
                                    onToggleCompleted={
                                        handleLocalToggleCompleted
                                    }
                                />
                            ),
                        )}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        itemsPerPage={
                            itemsPerPage
                        }
                        onPageChange={
                            handlePageChange
                        }
                        onItemsPerPageChange={
                            handleItemsPerPageChange
                        }
                    />
                </>
            )}
        </div>
    );
}

export default ActivityList;