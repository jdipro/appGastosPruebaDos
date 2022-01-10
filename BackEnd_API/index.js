const express = require('express')
const cors = require('cors')

const app = express();
app.use(cors())

const port = 3000

const transactions = [
    {
        "transactionType": "Egreso",
        "transactionDescription": "hamburguesas",
        "transactionAmount": "200",
        "transactionCategory": "Comida",
        "transactionId": 0
    },
    {
        "transactionType": "Egreso",
        "transactionDescription": "Dulce de leche",
        "transactionAmount": "300",
        "transactionCategory": "Antojo",
        "transactionId": 1
    },
    {
        "transactionType": "Ingreso",
        "transactionDescription": "ingreso",
        "transactionAmount": "600",
        "transactionCategory": "Transporte",
        "transactionId": 2
    }

]
//aquí un console.log(transactions) -> me lo va a mostrar en node index.js del cmd, sino, no. Sólo localHost. No afecta a postman.

app.get('/', (req, res) => {
    res.send(`Ok, ingresaron a localhost! ${port}`)
})

app.get('/transactions', (req, res) => {
    res.send(transactions)
})

app.get('/transactions/:id', (req, res) => {
    const transactionId = req.params.id;
    const selectedTransaction = transactions.filter(transaction => transaction.transactionId == transactionId);
    res.send(selectedTransaction)
})

app.post('/transactions', (req, res) => {
    //obteneme la transaccion que viene en la request, guardala en una variable llamada transaction y guardala en el array global. respondé q está ok.
    const transaction = 'Acá va la transaction que me vino';
    transactions.push(transaction)
    res.send('Todo ok')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
