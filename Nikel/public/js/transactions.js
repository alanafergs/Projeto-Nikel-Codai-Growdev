const myModal = new bootstrap.Modal("#transactionModal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);

//ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    });

    if (!cashNegative()) {
        e.target.reset();
        return;
    }

    sortTransactionsByDate();

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions();

    alert ("Lançamento adicionado com sucesso!");

});

checkLogged();

function checkLogged() {
    if(session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if(!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if(dataUser) {
        data = JSON.parse(dataUser);

        sortTransactionsByDate(); 
    }

    getTransactions();

}

function cashNegative() {
    const totalBalance = data.transactions.reduce((acc, item) => acc + (item.type === "1" ? item.value : -item.value), 0);
    const type = document.querySelector('input[name="type-input"]:checked').value;

    if (type === "1") {
        
        return true;
    }

    if (totalBalance < 0) {
        const confirma = confirm("Atenção! Após cadastrar essa despesa seu saldo será negativo. \nDeseja continuar?");

        if (!confirma) {
            alert("Operação cancelada.");
          
            data.transactions.shift(); 
            return false;
        }
    }

    return true;
}

function sortTransactionsByDate() {
    data.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = ``;

    if(transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";

            if(item.type === "2") {
                type = "Saída";
            }

            transactionsHtml += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                </tr>
            `
        })
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));        
}