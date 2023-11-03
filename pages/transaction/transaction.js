if (!isNewTransaction()) {
    const uid = getTransationUid()
    findTransactionByUid(uid)
}

function getTransationUid() {
    const urlParams = new URLSearchParams(window.location.search);

    return (urlParams.get('uid'));
}

function isNewTransaction() {
    return getTransationUid() ? false : true;
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? 'block' : 'none';

    toggleSaveButtonDisabled();
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

function fillTransactionScreen(transaction) {

    if (transaction.type == 'expense') {
        form.typeExpense().checked = true;
    } else {
        form.typeIncome().checked = true;
    }

    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transactionType;

    if (transaction.description) {
        form.description().value = transaction.description;
    } else {

    }
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? 'block' : 'none';
    form.valueLessOrEqualZeroError().style.display = value <= 0 ? 'block' : 'none';

    toggleSaveButtonDisabled();
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    form.transactionTypeRequiredError().style.display = !transactionType ? 'block' : 'none';

    toggleSaveButtonDisabled();
}


function toggleSaveButtonDisabled() {
    form.saveButton().disabled = !isFormValid();
}

function isFormValid() {
    const date = form.date().value;
    if (!date) {
        return false;
    }

    const value = form.value().value;
    if (!value || value.length <= 0) {
        return false
    }

    const transactionType = form.transactionType().value;
    if (!transactionType) {
        return false;
    }

    return true;
}

function saveTransaction() {

    showLoading();
    const transaction = createTransaction();

    if (isNewTransaction()) {
        save(transaction);
    } else {
        update(transaction);
    }
}

function save(transaction) {
    transactionService.save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = '../home/home.html'
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transação');
        })
}

function update(transaction) {
    showLoading();

    transactionService.update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = '../home/home.html'

        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transação');
        })
}

function cancelTransaction() {
    window.location.href = '../home/home.html';
}

function createTransaction() {
    return {
        type: form.typeExpense().checked ? 'expense' : 'income',
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value)
        },
        transactionType: form.transactionType().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    }
}

const form = {
    date: () => document.querySelector('#date'),
    saveButton: () => document.querySelector('#save-button'),
    description: () => document.querySelector('#description'),
    dateInvalidError: () => document.querySelector('#date-invalid-error'),
    dateRequiredError: () => document.querySelector('#date-required-error'),
    transactionType: () => document.querySelector('#transaction-type'),
    typeExpense: () => document.querySelector('#expense'),
    typeIncome: () => document.querySelector('#income'),
    transactionTypeRequiredError: () => document.querySelector('#transaction-type-required-error'),
    value: () => document.querySelector('#value'),
    currency: () => document.querySelector('#currency'),
    valueRequiredError: () => document.querySelector('#value-required-error'),
    valueLessOrEqualZeroError: () => document.querySelector('#value-less-or-equal-to-zero-error')
}