import { useState } from "react";

import ActivityList from "./component/ActivityList";

import {
  toggleActivityCompleted,
} from "./services/activityService";

function App() {
  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  const [reloadKey, setReloadKey] =
    useState(0);

  // Gestisce il cambio di stato
  // di completamento di un'attività.
  const handleToggleCompleted = async (
    id: number,
  ) => {
    try {
      await toggleActivityCompleted(id);

      // forza il refetch della lista
      setReloadKey((prev) => prev + 1);
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
        reloadKey={reloadKey}
      />
    </main>
  );
}

export default App;