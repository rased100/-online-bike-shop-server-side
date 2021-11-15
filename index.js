const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4mso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('motorbikeDB');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const commentCollection = database.collection('comments');

        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // app.get('/orders', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const cursor = orderCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // })


        // my orders

        app.get('/myorders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = orderCollection.find(query);
            const myorders = await cursor.toArray();
            res.send(myorders);
        })

        // my orders

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            // console.log('load product with id: ', id);
            res.send(product);
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
        })

        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            // console.log('cmt', result);
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })


        // DELETE API
        // app.delete('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await usersCollection.deleteOne(query);

        //     console.log('deleting user with id ', result);

        //     res.json(result);
        // })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello Sun Motorbike!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})