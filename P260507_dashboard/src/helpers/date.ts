//data odierna in formato americano (YYYY-MM-DD)
export function oggiISO(): string {
  return new Date().toISOString().slice(0, 10);
}

//Formatta una data nel formato italiano (GG/MM/YYYY)
//data - Stringa ISO o null/undefined
//ritorna Data formattata o "—" se non valida

export function formattaData(data: string | undefined | null): string {
  if (!data) return "—";
  const d = new Date(data);
  if (isNaN(d.getTime())) return data;
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}