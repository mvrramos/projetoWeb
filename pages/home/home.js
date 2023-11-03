function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = '../../index.html'
    }).catch((error) => {
        alert("Erro ao fazer logout");
    });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        findTransaction(user);
    };
})

function newTransaction() {
    window.location.href = '../transaction/transaction.html';
}

function findTransaction(user) {
    showLoading();
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransitionsToScreen(transactions)
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert("Erro ao buscar transações");
        })
}

function addTransitionsToScreen(transactions) {
    const orderedList = document.querySelector("#transactions");

    transactions.forEach(transaction => {

        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));

        li.appendChild(createParagraph(formatDate(transaction.date)));
        li.appendChild(createParagraph(formatMoney(transaction.money)));
        li.appendChild(createParagraph(transaction.transactionType));

        if (transaction.description) {
            li.appendChild(createParagraph(transaction.description));
        }

        orderedList.appendChild(li);
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.id = transaction.uid;
    li.addEventListener('click', () => {
        window.location.href = '../transaction/transaction.html?uid=' + transaction.uid;
    });

    return li;
}

function createDeleteButton(transaction) {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Remover';
    deleteButton.classList.add('outline', 'danger');
    deleteButton.addEventListener('click', event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    });
    return deleteButton;
}

function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;

    return element;
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm("Deseja remover a transação?");
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    transactionService.remove(transaction)
        .then(() => {
            hideLoading();
            document.querySelector("#" + transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert("Erro ao excluir transação");
        })
}


function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`;
}

