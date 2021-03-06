const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvxwy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("wareHouse").collection("inventory");
    const galleryCollection = client.db("wareHouse").collection("gallery");

    app.get("/inventory", async (req, res) => {
      const quary = {};
      const cursor = serviceCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/gallery", async (req, res) => {
      const quary = {};
      const cursor = galleryCollection.find(quary);
      const result = await cursor.toArray();
      res.send(result);
    });

    //GET
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: ObjectId(id) };
      const inventory = await serviceCollection.findOne(quary);
      res.send(inventory);
    });

    //POST
    app.post("/inventory", async (req, res) => {
      console.log(req.body);
      const newInventory = req.body;
      const result = await serviceCollection.insertOne(newInventory);
      res.send(result);
    });

    //DELETE FROM INVENTORY ITEMS
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Warehouse connected to server. Response available in browser.");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
