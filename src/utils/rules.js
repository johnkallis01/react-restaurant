export const rules = {
    name: /^[a-zA-Z ]{2,30}$/,
    phone: /^\d{10}$/,
    email: /.+@.+\..+/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/,
};