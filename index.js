const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middleware 
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbflg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        await client.connect();
        const clothsCollection = client.db("Todo-App").collection("todo");

        // get all data 
        app.get("/todos", async (req, res) => {
            const query = {}
            const cursor = clothsCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })

        // // get data by email
        // app.get("/cloth", verifyJWT, async (req, res) => {
        //     const decoddedEmail = req.decoded.email;
        //     const email = req.query.email;
        //     console.log(decoddedEmail, email);
        //     if (email === decoddedEmail) {
        //         const query = { email }
        //         const cursor = clothsCollection.find(query)
        //         const result = await cursor.toArray();
        //         console.log(result);
        //         res.send(result)
        //     } else {
        //         console.log("error");
        //         res.status(403).send({ message: "forbidden access" })
        //     }
        // })


        // Post data
        app.post("/todo", async (req, res) => {
            const todo = req.body;
            if (Object.keys(todo).length < 0) {
                return res.send({ success: false, message: 'Data currectly not send' })
            }
            const result = await clothsCollection.insertOne(todo);
            if (result.insertedId) {
            res.send({ success: true, message: `Succesfuly added ${todo.todo}` })
            }
        })

        // // update data 
        // app.put("/cloth/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const cloth = req.body;
        //     const filter = { _id: ObjectId(id) }
        //     const option = { upsert: true }
        //     const updateDoc = {
        //         $set: cloth
        //     }
        //     const result = await clothsCollection.updateOne(filter, updateDoc, option);
        //     res.send(result)

        // })

        // delete data 
        app.delete("/todo/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await clothsCollection.deleteOne(query);
            if (result.deletedCount < 1) {
                res.send({ success: false, message: "Somthing is Wrong" })
            } else {
                res.send({ success: true, message: "Deleted Successfull" })
            }
        })



    }
    finally {
        // client.close();
    }
}
run().catch(console.dir)





app.get("/", (req, res) => res.send("Welcome to Todo App server"))
app.listen(port, () => console.log("Port is", port))