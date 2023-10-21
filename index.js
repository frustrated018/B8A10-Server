const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// DB Connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hq7fxqk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client
      .db("clothingCoveDB")
      .collection("products");
    const brandsCollection = client.db("clothingCoveDB").collection("brands");
    const cartCollection = client.db("clothingCoveDB").collection("cart");

    // cart route

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // adding products to cart
    app.post("/cart", async (req, res) => {
      const newProduct = req.body;
      const result = await cartCollection.insertOne(newProduct);
      console.log(result);
      res.send(result);
    });

    // finding products in the cart by email

    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Deleting for cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // brands route

    app.get("/brands", async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Products route

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // adding products to database
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log(result);
      res.send(result);
    });

    // Updating product in the database
    app.put("/products/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          productName: updateProduct.productName,
          brandName: updateProduct.brandName,
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.category,
          photo: updateProduct.photo,
          description: updateProduct.description,
          longerDescription: updateProduct.longerDescription,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    // finding products by brand name

    app.get("/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // finding product by _id

    app.get("/products/details/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Clothing Cove server up And running");
});

app.listen(port, () => {
  console.log(`Running on PORT: ${port}`);
});
