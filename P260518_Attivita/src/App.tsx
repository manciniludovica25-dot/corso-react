import { useState } from "react";

import ActivityList from "./component/ActivityList";

import {
    toggleActivityCompleted,
} from "./services/activityService";

function App() {
    const [selectedId, setSelectedId] =
        useState<number | null>(null);

    // Gestisce il cambio di stato di completamento di un'attività. Passato come prop a ActivityList, che lo passa a sua volta ad ActivityRow, 
    // dove viene chiamato al click del pulsante per cambiare stato.
    const handleToggleCompleted = async (
        id: number,
    ) => {
        try {
            await toggleActivityCompleted(id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="app">
            <h1 className="app__title">
                Gestione Attività
            </h1>

            <ActivityList
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onToggleCompleted={
                    handleToggleCompleted
                }
            />
        </main>
    );
}

export default App;