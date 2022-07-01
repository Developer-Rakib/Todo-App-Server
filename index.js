const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware 
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbflg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        await client.connect();
        const todoCollection = client.db("Todo-App").collection("todo");

        // get all data 
        app.get("/todos", async (req, res) => {
            const query = {}
            const cursor = todoCollection.find(query)
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
            const result = await todoCollection.insertOne(todo);
            if (result.insertedId) {
                res.send({ success: true, message: `Succesfuly added ${todo.todo}` })
            }
        })

        // edit data 
        app.put("/todoEdit/:id", async (req, res) => {
            const id = req.params.id;
            const upTodo = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: upTodo
            };
            const result = await todoCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        // complete data 
        app.put("/todo/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: { complete: 'done' }
            };
            const result = await todoCollection.updateOne(filter, updateDoc);
            res.send(result)
        })


        // delete data 
        app.delete("/todo/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await todoCollection.deleteOne(query);
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