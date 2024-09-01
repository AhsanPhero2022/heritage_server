const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect(); // Ensure MongoDB client is connected
    console.log("Connected to MongoDB");

    const db = client.db("sm_technology");
    const propertiesCollection = db.collection("properties");
    const bidProperties = db.collection("bid_properties");
    const testimonialsCollection = db.collection("testimonials");

    // GET all properties
    app.get("/properties", async (req, res) => {
      const result = await propertiesCollection.find().toArray();
      res.send(result);
    });
    // GET all testimonials
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });

    // POST a new property
    app.post("/properties", async (req, res) => {
      const property = req.body;
      const result = await propertiesCollection.insertOne(property);
      res.send(result);
    });

    // GET properties by category
    app.get("/category", async (req, res) => {
      const result = await propertiesCollection.find().toArray();
      result.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
      });
      res.send(result);
    });

    // GET a property by ID
    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });

    // PUT to update a property price
    app.post("/testimonials", async (req, res) => {
      const property = req.body;
      const result = await testimonialsCollection.insertOne(property);
      res.send(result);
    });
    app.post("/bid_properties", async (req, res) => {
      const property = req.body;
      const result = await bidProperties.insertOne(property);
      res.send(result);
    });

    // PUT to update a property price
    app.put("/properties/:id", async (req, res) => {
      try {
        const { price, user } = req.body;
        const propertyId = req.params.id;
        const filter = { _id: new ObjectId(propertyId) };
        const updateDoc = {
          $set: { price: price, userId: user },
        };

        const result = await propertiesCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json({ message: "Property updated successfully" });
      } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // DELETE a property by ID
    app.delete("/properties/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
    // Add any necessary cleanup code here
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});

module.exports = app;
