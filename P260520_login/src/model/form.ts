export type FormValues = {
    email:string,
    password: string,
    confirmPassword: string,
    terms: "" | "accepted" | "rejected";
}

export type FormErrors = {
    email: string,
    password: string,
    confirmPassword: string,
    terms: string
}

export type FormTouched = {
    email: boolean,
    password: boolean,
    confirmPassword: boolean,
    terms: boolean
}
