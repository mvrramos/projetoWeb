// Aguarda o evento de mudança de autenticação antes de carregar os gráficos
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Funções que você deseja chamar ao iniciar a página
        resumeChart(user);
        pieIncomeChart(user);
        pieExpenseChart(user);
        lineChart(user);
    } else {
        console.log('Usuário não autenticado');
    }
});

function resumeChart(user) {
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();

            const data = transactions.map(transaction => ({
                Valor: transaction.money.value, // Alterado para pegar o valor diretamente
                Tipo: transaction.type,
                Categoria: transaction.transactionType,
            }));

            // Chame a função que cria o gráfico de barras aqui, passando 'data'
            createresumeChart(data);
        })
        .catch(error => {
            console.log('Erro ao carregar as transações', error);
        });
}

function pieIncomeChart(user) {
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();

            const incomeData = transactions
                .filter(transaction => transaction.type === 'income')
                .reduce((acc, transaction) => {
                    const category = transaction.transactionType || 'Sem Categoria';
                    acc[category] = (acc[category] || 0) + transaction.money.value;
                    return acc;
                }, {});

            // Chame a função que cria o gráfico de pizza de receitas aqui, passando 'incomeData'
            createPieChartIncome(incomeData);
        })
        .catch(error => {
            console.log('Erro ao carregar as transações de receitas', error);
        });
}

function pieExpenseChart(user) {
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();

            const expenseData = transactions
                .filter(transaction => transaction.type === 'expense')
                .reduce((acc, transaction) => {
                    const category = transaction.transactionType || 'Sem Categoria';
                    acc[category] = (acc[category] || 0) + transaction.money.value;
                    return acc;
                }, {});

            // Chame a função que cria o gráfico de pizza de despesas aqui, passando 'expenseData'
            createPieChartExpense(expenseData);
        })
        .catch(error => {
            console.log('Erro ao carregar as transações de despesas', error);
        });
}

function lineChart(user) {
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();

            const data = transactions.map(transaction => ({
                date: transaction.date,
                income: transaction.type === 'income' ? transaction.money.value : 0,
                expense: transaction.type === 'expense' ? transaction.money.value : 0,
            }));

            createLineChart(data);
        })
        .catch(error => {
            console.log('Erro ao carregar as transações para o gráfico de linha', error);
        });
}

// Função para criar o gráfico de barras
function createresumeChart(data) {
    const ctx = document.querySelector('#resumeChart').getContext('2d');

    const total = data.reduce((acc, transaction) => acc + parseFloat(transaction.Valor), 0);

    // Atualize o campo usado para distinguir entre entradas e saídas (tipo de transação)
    const totalIncome = data
        .filter(transaction => transaction.Tipo === 'income') // Certifique-se de que 'Tipo' seja o campo correto
        .reduce((acc, transaction) => acc + parseFloat(transaction.Valor), 0);

    const totalExpense = data
        .filter(transaction => transaction.Tipo === 'expense') // Certifique-se de que 'Tipo' seja o campo correto
        .reduce((acc, transaction) => acc + parseFloat(transaction.Valor), 0);

    const resumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total', 'Entradas', 'Saídas'],
            datasets: [{
                label: 'Valores',
                data: [total, totalIncome, totalExpense],
                backgroundColor: ['blue', 'green', 'red'],
            }],
        },
    });
}

// Função para criar o gráfico de pizza de receitas
function createPieChartIncome(incomeData) {
    const ctx = document.querySelector('#pieChartIncome').getContext('2d');

    const pieChartIncome = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(incomeData),
            datasets: [{
                data: Object.values(incomeData),
                backgroundColor: ['green', 'lightgreen', 'lime', 'darkgreen', 'forestgreen'],
            }],
        },
    });
}

// Função para criar o gráfico de pizza de despesas
function createPieChartExpense(expenseData) {
    const ctx = document.querySelector('#pieChartExpense').getContext('2d');

    const pieChartExpense = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(expenseData),
            datasets: [{
                data: Object.values(expenseData),
                backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
            }],
        },
    });
}

function createLineChart(data) {
    const ctx = document.querySelector('#lineChart').getContext('2d');

    // Modifique esta parte conforme necessário para se adequar aos seus dados
    const labels = data.map(transaction => transaction.date); // Use as datas como rótulos
    const incomeValues = data.map(transaction => transaction.income); // Use os valores de receita como dados
    const expenseValues = data.map(transaction => transaction.expense); // Use os valores de despesa como dados

    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Receitas',
                    data: incomeValues,
                    borderColor: 'green',
                    fill: false,
                },
                {
                    label: 'Despesas',
                    data: expenseValues,
                    borderColor: 'red',
                    fill: false,
                },
            ],
        },
    });
}

function goToVideo() {
    window.location.href = '../video/video.html';
}
