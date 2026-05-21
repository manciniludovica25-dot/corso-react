import { useState } from "react";
import type { FormValues, FormTouched, FormErrors } from "../model/form";

export function RegistrationForm() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const [touched, setTouched] = useState<FormTouched>({
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const allTouched = Object.values(touched).every(Boolean);

  const noErrors = Object.values(errors).every((error) => error === "");

  const allFilled =
    values.email.trim() !== "" &&
    values.password !== "" &&
    values.confirmPassword !== "" &&
    values.terms !== "";

  const isSubmitDisabled = !allTouched || !allFilled || !noErrors;

  const validateField = (
    name: keyof FormValues,
    value: string,
    currentValues: FormValues,
  ): string => {
    switch (name) {
      case "email":
        if (!value.trim()) {
          return "Il campo email è obbligatorio";
        }

        if (!emailRegex.test(value)) {
          return "Inserisci un email valida";
        }

        return "";

      case "password":
        if (!value) {
          return "Il campo password è obbligatorio";
        }

        if (!passwordRegex.test(value)) {
          return (
            "La password deve essere di almeno 8 caratteri e contenere una lettera maiuscola, " +
            "una lettera minuscola, un numero e un simbolo"
          );
        }

        return "";

      case "confirmPassword":
        if (!value) {
          return "Il campo conferma password è obbligatorio";
        }

        if (value !== currentValues.password) {
          return "Le password non coincidono";
        }
        return "";

      case "terms":
        if (value !== "accepted") {
          return "Devi accettare i termini d'uso e la normativa sulla privacy";
        }

        return "";

      default:
        return "";
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const updatedValues = { ...values, [name]: value } as FormValues;

    setValues(updatedValues);

    const errorMessage = validateField(
      name as keyof FormValues,
      value,
      updatedValues,
    );

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;

    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));

    const fieldName = name as keyof FormValues;

    const errorMessage = validateField(fieldName, values[fieldName], values);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email"> Email:</label>
      <input required
        id="email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <p>{errors.email}</p>}

      <label htmlFor="password"> Password:</label>
      <input required
        id="password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <p>{errors.password}</p>}

      <label htmlFor="confirmPassword"> Conferma Password:</label>
      <input required
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.confirmPassword && errors.confirmPassword && (
        <p>{errors.confirmPassword}</p>
      )}
<fieldset>
  <legend>
    Accetti i Termini D'uso e la Normativa sulla privacy?
  </legend>

  <div className="radio-group">
    <label className="radio-option">
      <input
        required
        id="termsAccepted"
        type="radio"
        name="terms"
        value="accepted"
        checked={values.terms === "accepted"}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      Accetto
    </label>

    <label className="radio-option">
      <input
        id="termsRejected"
        type="radio"
        name="terms"
        value="rejected"
        checked={values.terms === "rejected"}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      Non accetto
    </label>
  </div>
</fieldset>

{touched.terms && errors.terms && (
  <p>{errors.terms}</p>
)}

<button
  type="submit"
  disabled={isSubmitDisabled}
>
  Invia
</button>
    </form>
  );
}
