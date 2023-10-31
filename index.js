const form = {
    email: () => document.querySelector("#email"),
    emailRequired: () => document.querySelector("#email-required-error"),
    emailInvalid: () => document.querySelector("#email-invalid-error"),
    password: () => document.querySelector("#password"),
    passwordRequired: () => document.querySelector("#password-required-error"),
    recoverPassword: () => document.querySelector("#recover-password-button"),
    loginButton: () => document.querySelector("#login-button")
};

// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         window.location.href = '/pages/home/home.html'
//     }
// })

function onChangeEmail() {
    toggleEmailError();
    toggleButtonDisabled();
};

function onChangePassword() {
    togglePasswordError();
    toggleButtonDisabled();
};

function isEmailValid() {
    let email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
};

function toggleEmailError() {
    let email = form.email().value
    form.emailRequired().style.display = email ? 'none' : 'block';

    form.emailInvalid().style.display = isEmailValid(email) ? 'none' : 'block';

}

function togglePasswordError() {
    let password = form.password().value;
    form.passwordRequired().style.display = password ? 'none' : 'block';
}

function toggleButtonDisabled() {
    let emailValid = isEmailValid();
    form.recoverPassword().disabled = !emailValid

    let passwordValid = isPasswordValid();
    form.loginButton().disabled = !passwordValid || !emailValid
};

function isPasswordValid() {
    let password = form.password().value;

    if (!password) {
        return false;
    }
    return true;
};

function login() {
    showLoading();

    firebase.auth().signInWithEmailAndPassword(
        form.email().value, form.password().value
    ).then(response => {
        hideLoading();
        window.location.href = "pages/home/home.html"
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

function goToRegister() {
    showLoading();
    window.location.href = "pages/register/register.html"

};

function recoverPassword() {
    showLoading();

    firebase.auth().sendPasswordResetEmail(form.email().value).then(response => {
        hideLoading();
        alert("Email enviado com sucesso");
    }).catch(error => {
        hideLoading();
        alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
    if (error.code == "auth/missing-email") {
        return "Usuário não encontrado"
    }
    if (error.code == "auth/invalid-login-credentials") {
        return "Login ou senha incorreto"
    }
    if (error.code == "auth/wrong-password") {
        return "Senha inválida"
    }
    return error.code;
}