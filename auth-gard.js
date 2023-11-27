// Verificar status do usuário
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "../../index.html";
    }
});

// Logout
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = '../../index.html'
    }).catch((error) => {
        alert("Erro ao fazer logout");
    });
}