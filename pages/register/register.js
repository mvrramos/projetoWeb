const form = {
    email: () => document.querySelector("#email"),
    emailInvalid: () => document.querySelector("#email-invalid-error"),
    emailRequired: () => document.querySelector("#email-required-error"),
    password: () => document.querySelector("#password"),
    passwordRequired: () => document.querySelector("#password-required-error"),
    passwordInvalid: () => document.querySelector("#password-min-length-error"),
    confirmPassword: () => document.querySelector("#confirm-password"),
    confirmPasswordError: () => document.querySelector("#password-doesnt-match-error"),
    registerButton: () => document.querySelector("#register-button"),
    loginButton: () => document.querySelector("#login-button")
}

function onChangeEmail() {
    const email = form.email().value;

    form.emailRequired().style.display = email ? "none" : "block";
    form.emailInvalid().style.display = validateEmail(email) ? "none" : "block";

    toggleRegisterButtonDisabled();
}

function onChangePassword() {
    const password = form.password().value;

    form.passwordRequired().style.display = password ? "none" : "block";
    form.passwordInvalid().style.display = password.length >= 6 ? "none" : "block";

    validatePasswordsMatch();
    toggleRegisterButtonDisabled();

}

function onChangeConfirmPassword() {
    validatePasswordsMatch();
    toggleRegisterButtonDisabled();
}

function validatePasswordsMatch() {
    const password = form.password().value;
    const confirmPassword = form.confirmPassword().value;

    form.confirmPasswordError().style.display = password == confirmPassword ? "none" : "block";
}

function toggleRegisterButtonDisabled() {
    form.registerButton().style.display = !isFormInvalid();
}

function isFormInvalid() {
    const email = form.email().value;
    if (!email || !validateEmail(email)) {
        return false;
    }
    const password = form.password().value;
    if (!password || password.length < 6) {
        return false;
    }
    const confirmPassword = form.confirmPassword().value;
    if (password != confirmPassword) {
        return false;
    }
    return true;
}