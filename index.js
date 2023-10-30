function validateFields() {
    toggleButtonDisasble();
    toggleEmailErrors();
}

function toggleEmailErrors() {
    const email = document.getElementById('email').value;
}

function toggleButtonDisasble() {
    const emailValid = isEmailValid();
    document.getElementById("recover-password-button").disabled = !emailValid;

    const passwordValid = isPasswordValid();
    document.getElementById("login-button").disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = document.getElementById("email").value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function isPasswordValid() {
    const password = document.getElementById("password").value;

    if (!password) {
        return false;
    }
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


