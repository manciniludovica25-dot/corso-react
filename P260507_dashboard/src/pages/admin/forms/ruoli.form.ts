import { ConfigurazioneCampoForm } from "../../../types";

export function campiRuoliForm(): ConfigurazioneCampoForm[] {
  return [
    { nome: "nome", etichetta: "Nome ruolo", tipo: "text" },
    { nome: "descrizione", etichetta: "Descrizione", tipo: "textarea" },
  ];
}