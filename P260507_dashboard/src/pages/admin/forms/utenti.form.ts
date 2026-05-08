import { ConfigurazioneCampoForm, RuoloAdmin } from "../../../types";

export function campiUtentiForm(roles: RuoloAdmin[]): ConfigurazioneCampoForm[] {
  return [
    { nome: "nome", etichetta: "Nome completo", tipo: "text" },
    { nome: "username", etichetta: "Username", tipo: "text" },
    { nome: "email", etichetta: "Email", tipo: "email" },
    {
      nome: "ruoloId",
      etichetta: "Ruolo",
      tipo: "select",
      opzioni: () => roles.filter(r => r.isActive).map(r => ({ valore: r.id, etichetta: r.nome })),
    },
  ];
}