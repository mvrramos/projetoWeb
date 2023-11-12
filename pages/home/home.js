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
        calculateAndDisplayTotals(user);
    }
});

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


function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                fillTransactionScreen(transaction);

                const value = transaction.money.value;

                const totalIncomeElement = document.querySelector("#totalIncome span");
                totalIncomeElement.textContent = value.toFixed(2);

                toggleSaveButtonDisabled();
            } else {
                alert("Documento não encontrado");
                window.location.href = '../home/home.html';
            }
        })
        .catch((error) => {
            hideLoading();
            alert("Erro ao preencher documento");
        });
}

function createTotalElement(id, labelText) {
    const totalElement = document.createElement('div');
    totalElement.id = id;

    const label = document.createTextNode(labelText);

    const span = document.createElement('span');
    span.textContent = '0.00'; // Valor padrão

    totalElement.appendChild(label);
    totalElement.appendChild(span);

    return totalElement;
}

function createResumeElements() {
    const resumeElement = document.createElement('div');
    resumeElement.id = 'resume';

    const totalIncomeElement = createTotalElement('totalIncome', 'Entradas: ');
    const totalExpenseElement = createTotalElement('totalExpense', 'Saídas: ');
    const totalBalanceElement = createTotalElement('totalBalance', 'Total: ');

    resumeElement.appendChild(totalIncomeElement);
    resumeElement.appendChild(totalExpenseElement);
    resumeElement.appendChild(totalBalanceElement);

    const transactionsList = document.getElementById('transactions');
    transactionsList.parentNode.insertBefore(resumeElement, transactionsList);
}


function calculateTotal(transactions) {
    return transactions.reduce((total, transaction) => {
        const moneyValue = transaction.money.value;
        return total + moneyValue;
    }, 0);
}

function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
            hideLoading();
            if (transaction) {
                fillTransactionScreen(transaction);
                toggleSaveButtonDisabled();
            } else {
                alert("Documento não encontrado");
                window.location.href = '../home/home.html';
            }
        })
        .catch((error) => {
            hideLoading();
            alert("Erro ao preencher documento");
        });
}

function calculateAndDisplayTotals(user) {
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();

            const totalIncome = calculateTotal(transactions, 'income');
            const totalExpense = calculateTotal(transactions, 'expense');
            const total = totalIncome - totalExpense;

            updateTotalElement('totalBalance', 'Total: ', total);
            updateTotalElement('totalIncome', 'Entradas: ', totalIncome);
            updateTotalElement('totalExpense', 'Saídas: ', totalExpense);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert("Erro ao buscar transações");
        });
}

function calculateTotal(transactions, type) {
    return transactions
        .filter(transaction => transaction.type === type)
        .reduce((total, transaction) => total + transaction.money.value, 0);
}

function updateTotalElement(id, labelText, value) {
    const totalElement = document.getElementById(id);

    if (totalElement) {
        const span = totalElement.querySelector('span');
        if (span) {
            span.textContent = value.toFixed(2); // Arredonde para 2 casas decimais
        }
    } else {
        // Criação do elemento
        const newTotalElement = createTotalElement(id, labelText);
        // Adição do elemento após o botão "Sair"
        const header = document.querySelector('header');
        header.parentNode.insertBefore(newTotalElement, header.nextSibling);
        // Atualização do valor no novo elemento
        updateTotalElement(id, labelText, value);
    }
}

createResumeElements();