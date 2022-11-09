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
// // jwt verify start
// function verifyjwt(req, res, next) {
//   const authtoken = req.headers.authorization;
//   if (!authtoken) {
//     return res.send({ massage: "unauthrizaed access" });
//   }
//   jwt.verify(authtoken, process.env.ACCESS_TOKEN, function (error, decoded) {
//     if (error) {
//       return res.send({ massage: "unauthrizaed access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

// collection mongodb
async function run() {
  try {
    const productsCollection = client.db("foodDb").collection("products");
    const reviewCollection = client.db("reviewDb").collection("reviewss");

   //  // jwt sign
   //  app.post("/jwt", (req, res) => {
   //    const user = req.body;
   //    console.log(user);
   //    const token = jwt.sign(user, process.env.ACCESS_TOKEN);
   //    res.send({ token });
   //  });

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
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const review = reviewCollection.find(query).sort({ time: -1 });
      const result = await review.toArray();
      res.send(result);
    });

    // addServices post
    app.post("/services", (req, res) => {
      const items = req.body;
    });

    // my reviews post
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const cursor = await reviewCollection.insertOne(review);
      res.send(cursor);
    });

   //  app.patch("/orders/:id", async (req, res) => {
   //    const id = req.params.id;
   //    const status = req.body.status;
   //    const fillter = { _id: ObjectId(id) };
   //    const options = { upsert: true };
   //    const updateDoc = {
   //      $set: {
   //        status: status,
   //      },
   //    };
   //    const result = await orderCollection.updateOne(
   //      fillter,
   //      updateDoc,
   //      options
   //    );
   //    res.send(result);
   //  });




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
