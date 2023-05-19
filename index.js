const express = require('express');
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000

const app = express();

 /* -------------------------------------------------------------------------- */
 /*                                 MIDDLEWARE                                 */
 /* -------------------------------------------------------------------------- */
app.use(express.json());
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                                  DATABASE                                  */
/* -------------------------------------------------------------------------- */
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yq2vgbi.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const toyCollection = await client.db("toysStore").collection("toys");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Toy Store Database is Connected");

    
  /* -------------------------------------------------------------------------- */
  /*                                  GET ROUTE                                 */
  /* -------------------------------------------------------------------------- */

    /* ------------------------------ GET ALL TOYS ------------------------------ */
  app.get("/allToys", async (req, res) => {
    let query = {};
    if (req.query?.email) {
      query = { sellerEmail: req.query.email };
    }
    const result = await toyCollection.find(query).toArray();

    res.send(result);
  });

    app.get('/toyDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await toyCollection.findOne(query)

      res.send(result)
    })


   
    app.get('/updateToy/:id', async(req, res) =>{
      const id = req.params.id;
      
      const query = {_id: new ObjectId(id)};
      const result = await toyCollection.findOne(query);

      res.send(result);
    })

    /* -------------------------------------------------------------------------- */
    /*                                UPDATE ROUTE                                */
    /* -------------------------------------------------------------------------- */

    app.patch('/updateToy/:id', async (req, res) => {
      const updated = req.body
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {$set:{
        price: updated.price,
        quantity:updated.quantity,
        description:updated.description
      }};

      const result = await toyCollection.updateOne(filter, updateDoc)

      res.send(result);

      console.log(updateDoc);
    })

  
   /* -------------------------------------------------------------------------- */
   /*                                 POST ROUTE                                 */
   /* -------------------------------------------------------------------------- */
    app.post("/addToy", async (req, res) => {
      const body = req.body;
      console.log(body);

      const result =await toyCollection.insertOne(body);

      res.send(result);

    });
 
    /* -------------------------------------------------------------------------- */
    /*                                DELETE ROUTE                                */
    /* -------------------------------------------------------------------------- */
 
    app.delete('/toys/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await toyCollection.deleteOne(filter)

      res.send(result);
 
      console.log(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */
app.get('/', (req,res) => {
    res.send('SERVER IS RUNNING')
})



/* -------------------------------------------------------------------------- */
/*                                  LISTENER                                  */
/* -------------------------------------------------------------------------- */
app.listen(port, () =>{
    console.log(`server is listening on port: ${port}`);
})