import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';

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
app.get("/studios", async(req, res) => {
     try{
          const email = req?.query?.email;
          const query = { email };

          const result = await studiosCollection.find(query).toArray();
          res.status(201).json(result);
     }catch(err) {
          console.error("Studio error:", err);
          res.status(500).json({ error: "Failed to fetch studios" })
     }
})

app.post("/studios", async(req, res) => {
     try{
          const studio = req?.body;
          
          const result = await studiosCollection.insertOne(studio);
          res.status(201).json(result);
     }catch(err) {
          console.error("Insert studio error:", err);
          res.status(500).json({ error: "Failed to create studio" })
     }
})

app.patch("/studio/:id", async(req, res) => {
     try{
          const id = req?.params?.id;
          const query = { _id: new ObjectId(id) };
          const studio = req?.body;
          const updatedStudio = {
               $set: studio
          };
          const options = { upsert: true };
          const result = await studiosCollection.updateOne(query, updatedStudio, options);
          console.log(studio, result);
          
          res.status(200).json(result);
     }catch(err) {
          console.log("Update studio error:", err);
          res.status(500).json({ error: "Failed to update studio" })
     }
})

app.listen(PORT, () => {
     console.log(`Server is running on the port: ${PORT}`);
});
