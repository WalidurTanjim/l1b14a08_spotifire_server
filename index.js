import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb';

const app = express();
const client = new MongoClient(process.env.MDB_URI);
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors({
     origin: "http://localhost:3000"
}));

// mdb configuration
export async function connectToMongoDB() {
     try {
          await client.connect();
          console.log("You successfully connected to MongoDB!");
          return client;
     } catch (err) {
          console.dir(err);
     }
};

const dbClient = await connectToMongoDB();
const db = dbClient.db("Spotifire");
const userCollection = db.collection("user");
const studiosCollection = db.collection("studios");

// studios related API
app.post("/studios", async(req, res) => {
     const studio = req?.body;
     
     const result = await studiosCollection.insertOne(studio);
     res.status(201).json(result);
})

app.listen(PORT, () => {
     console.log(`Server is running on the port: ${PORT}`);
});
