import { effettuaLogin, èAutenticato } from "../../utils/auth";

// Se già autenticato, vai direttamente all'admin
if (èAutenticato()) {
  window.location.href = "admin.html";
}

const form = document.getElementById("login-form") as HTMLFormElement;
const erroreDiv = document.getElementById("login-error") as HTMLDivElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = (document.getElementById("username") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  if (effettuaLogin(username, password)) {
    window.location.href = "admin.html";
  } else {
    erroreDiv.textContent = "Credenziali errate. Riprova.";
  }
});