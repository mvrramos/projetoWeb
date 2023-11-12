const form = {
    confirmPassword: () => document.querySelector("#confirm-password"),
    confirmPasswordDoesntMatchError: () => document.querySelector("#password-doesnt-match-error"),
    email: () => document.querySelector("#email"),
    emailInvalidError: () => document.querySelector("#email-invalid-error"),
    emailRequiredError: () => document.querySelector("#email-required-error"),
    password: () => document.querySelector("#password"),
    passwordMinLengthError: () => document.querySelector("#password-min-length-error"),
    passwordRequiredError: () => document.querySelector("#password-required-error"),
    registerButton: () => document.querySelector("#registerButton")
}

function onChangeEmail() {
    let email = form.email().value;

    form.emailRequiredError().style.display = email ? 'none' : 'block';
    form.emailInvalidError().style.display = validateEmail(email) ? 'none' : 'block';

    toggleRegisterButtonDisabled();
}

function onChangePassword() {
    let password = form.password().value;

    form.passwordRequiredError().style.display = password ? 'none' : 'block';
    form.passwordMinLengthError().style.display = password.length >= 6 ? 'none' : 'block';

    validatePasswordMatch();
    toggleRegisterButtonDisabled();
}

function onChangeConfirmPassword() {
    validatePasswordMatch();
    toggleRegisterButtonDisabled();
}

function validatePasswordMatch() {
    let password = form.password().value;
    let confirmPassword = form.confirmPassword().value;

    form.confirmPasswordDoesntMatchError().style.display = password == confirmPassword ? 'none' : 'block';
}

function toggleRegisterButtonDisabled() {
    form.registerButton().disabled = !isFormValid();
}

function isFormValid() {
    let email = form.email().value;
    if (!email || !validateEmail(email)) {
        return false;
    }

    let password = form.password().value;
    if (!password || password.length < 6) {
        return false;
    }

    let confirmPassword = form.confirmPassword().value;
    if (password != confirmPassword) {
        return false;
    }

    return true;
}

function goToLogin() {
    window.location.href = '/index.html';
}


function register() {
    showLoading();
    let email = form.email().value;
    let password = form.password().value;

    firebase.auth().createUserWithEmailAndPassword(
        email, password
    ).then(() => {
        hideLoading();
        window.location.href = '/pages/home/home.html';
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error.code));
    });
}

function getErrorMessage(error) {
    if (error = 'auth/email-already-in-use') {
        alert("Usuário já cadastrado");
    }
    if (error = 'undefined') {
        alert("Usuário já cadastrado");
    }

}

