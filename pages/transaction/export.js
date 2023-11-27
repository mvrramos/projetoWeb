function exportToExcel() {
    showLoading();

    // Obter dados do Firebase
    const user = firebase.auth().currentUser;

    if (user) {
        transactionService.findByUser(user)
            .then(transactions => {
                hideLoading();

                // Mapear dados para o formato desejado
                const data = transactions.map(transaction => ({
                    Data: formatDate(transaction.date),
                    valor: formatMoney(transaction.money),
                    Tipo: transaction.transactionType,
                    Descrição: transaction.description || ''
                }));

                // Criar planilha Excel
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Gastos');

                // Salvar a planilha como um arquivo Excel
                XLSX.writeFile(wb, 'Relatorio_de_Gastos.xlsx');
            })
            .catch(error => {
                hideLoading();
                console.error(error);
                alert("Erro ao buscar transações para exportar");
            });
    } else {
        hideLoading();
        alert("Usuário não autenticado");
    }
}
