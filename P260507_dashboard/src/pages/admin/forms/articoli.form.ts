import { ConfigurazioneCampoForm, AdminUser } from "../../../types";

export function campiArticoliForm(users: AdminUser[]): ConfigurazioneCampoForm[] {
  return [
    { nome: "titolo", etichetta: "Titolo", tipo: "text" },
    { nome: "corpo", etichetta: "Contenuto", tipo: "textarea" },
    {
      nome: "utenteId",
      etichetta: "Autore",
      tipo: "select",
      opzioni: () => users.filter(u => u.isActive).map(u => ({ valore: u.id, etichetta: u.nome })),
    },
  ];
}