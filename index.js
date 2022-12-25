const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle ware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://arbin:6R9SMiuPbMiQZGSm@cluster0.nj2hkmy.mongodb.net/?retryWrites=true&w=majority";
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('NazmaJute').collection('usersList');
        const productCollection = client.db('NazmaJute').collection('products');
       


    //    All Seller Api Are here listed


        // userslist
        app.get("/usersList", async (req, res) => {
            const query = {};
            const cursor = await userCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        app.post("/usersList", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        // admin api
        app.get('/usersList/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // sellerapi
        app.get('/usersList/worker/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })


        app.put("/usersList/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
            console.log(result);
            res.send(result);
        });



        app.delete("/usersList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // AddAProduct


        app.post("/products", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await productCollection.insertOne(items);
            res.send(result);
        });

        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = await productCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });


        // app.put("/products/admin/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const option = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             description: 'admin'
        //         }
        //     }
        //     const result = await userCollection.updateOne(filter, updateDoc, option);
        //     console.log(result);
        //     res.send(result);
        // });

    }
    finally {

    }
};

run().catch(err => console.log(err));








// Initial message
app.get("/", (req, res) => {
    res.send("Learn With Fun!");
});

app.listen(port, () => {
    console.log("Learn with Fun site running on port:", port);
});
