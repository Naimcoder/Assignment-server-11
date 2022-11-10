const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
require("dotenv").config();

//
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rge2daw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


// collection mongodb
async function run() {
  try {
    const productsCollection = client.db("foodDb").collection("products");
    const reviewCollection = client.db("reviewDb").collection("reviewss");



    //  3 items services
    app.get("/services", async (req, res) => {
      const service = productsCollection.find({});
      const result = await service.limit(3).toArray();
      res.send(result);
    });

    // all services get
    app.get("/servicesAll", async (req, res) => {
      const query = {};
      const service = productsCollection.find(query);
      const result = await service.toArray();
      res.send(result);
    });

    // single services get
    app.get(`/services/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await productsCollection.findOne(query);
      res.send(service);
    });

    // get reviews all
    app.get("/reviews", async (req, res) => {
      let query = {};
      const review = reviewCollection.find(query).sort({ time: -1 });
      const result = await review.toArray();
      res.send(result);
    });
    // my review page 
    app.get('/myreviews',async(req,res)=>{
      let query={};
      if (req.query?.email) {
        query={
          userEmail:req.query.email
        }
        console.log(query)
      }
      const review = reviewCollection.find(query);
      const result = await review.toArray();
      res.send(result)
    })

  //  single reviews 
  app.get("/reviews/:id",async(req,res)=>{
    const id = req.params.id
    const query = { _id: ObjectId(id) }
    const result= await reviewCollection.findOne(query)
    res.send(result)
  })

    // addServices post
    app.post("/services", async(req, res) => {
      const items = req.body;
      const cursor= await productsCollection.insertOne(items)
      res.send(cursor)
    });

    // my reviews post
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const cursor = await reviewCollection.insertOne(review);
      res.send(cursor);
    });
    // delete review
    app.delete("/reviews/:id",async(req,res)=>{
      const id= req.params.id
      const  query= {_id:ObjectId(id)}
      const result= await reviewCollection.deleteOne(query)
      res.send(result)
      console.log(result)
    })
// update items
    app.put("/reviews/:id", async (req, res) => {
      const id= req.params.id
      const filter= {_id:ObjectId(id)}
      const user= req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          userName:user.userName,
          userEmail:user.userEmail,
          review:user.review
        },
      };
    const result= await reviewCollection.updateOne(filter,updateDoc,options)
    res.send(result)
    });




  } finally {
  }
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("My Server running");
});

app.listen(port, () => {
  console.log(`my server Running${port}`);
});
