import { ConfigurazioneCampoForm, AdminPost, AdminUser } from "../../../types";

export function campiCommentiForm(posts: AdminPost[], users: AdminUser[]): ConfigurazioneCampoForm[] {
  return [
    {
      nome: "postId",
      etichetta: "Articolo",
      tipo: "select",
      opzioni: () => posts.filter(p => p.isActive).map(p => ({ valore: p.id, etichetta: p.titolo })),
    },
    { nome: "nome", etichetta: "Nome", tipo: "text" },
    { nome: "email", etichetta: "Email", tipo: "email" },
    { nome: "corpo", etichetta: "Commento", tipo: "textarea" },
  ];
}