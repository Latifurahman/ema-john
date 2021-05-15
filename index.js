const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4sklc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const dbName = process.env.DB_NAME;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(dbName).collection("products");
    const ordersCollection = client.db(dbName).collection("orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:key', (req, res) => {
        collection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })


    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        collection.find({key: { $in: productsKeys }})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })



});

app.get('/', (req, res)=>{
    res.send('Ema Watson!')
})


app.listen(port)
