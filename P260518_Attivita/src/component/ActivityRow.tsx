import type { Activity } from "../types/Activity.types";

type Props = {
    activity: Activity;
    selectedId: number | null;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    onToggleCompleted: (id: number) => void;
};

// component che si occupa di mostrare una singola attività con stato di completamento, descrizione e pulsante per cambiare stato. Gestisce anche l'espansione per 
//mostrare la descrizione dell' attività
function ActivityRow({ activity, selectedId, setSelectedId, onToggleCompleted }: Readonly<Props>) {
    const isSelected = selectedId === activity.id;

    return (
        <div className={`activity-card${isSelected ? " activity-card--selected" : ""}`}>
            <button
                type="button"
                className="activity-card__button"
                onClick={() => setSelectedId(activity.id)}
                aria-expanded={isSelected}
                aria-controls={`desc-${activity.id}`}
            >
                <h3 className="activity-card__title">{activity.name}</h3>

                <p className={`activity-card__status ${activity.isCompleted ? "activity-card__status--completed" : "activity-card__status--pending"}`}>
                    {activity.isCompleted ? "✅ Completata" : "⏳ Non completata"}
                </p>
            </button>

            <button
                type="button"
                className="activity-card__toggle"
                onClick={() => onToggleCompleted(activity.id)}
            >
                {activity.isCompleted ? "Segna come non completata" : "Completa attività"}
            </button>

            {isSelected && (
                <p id={`desc-${activity.id}`} className="activity-card__description">
                    {activity.description}
                </p>
            )}
        </div>
    );
}

export default ActivityRow;
