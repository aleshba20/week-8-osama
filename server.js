const express = require("express");

const app = express();

app.use(express.json());
app.set("port", 3000);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "Get, Head,Options,Post");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();
});

const MongoClient = require("mongodb").MongoClient;

let db;

MongoClient.connect(
  "mongodb+srv://aleshbariaz:Riaz@2002@gettingstarted.u6tba.mongodb.net/",
  (err, client) => {
    db = client.db("webstore");
  }
);

// display a message for root path to show that API is working

app.get("/", (req, res, next) => {
  res.send("Select a collection, e.g.,/collection/messages");
});

app.param("collectionName", (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  //   console.log('collection name: req.collection')
  return next();
});

// retrieve all the objects from an collection

app.get("/collection/:collectionName", (req, res, next) => {
  req.collection.find({}).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

//adding post

app.post("/collection/:collectionName", (req, res, next) => {
  req.collection.insert(req.body, (e, results) => {
    if (e) return next(e);
    res.send(results.ops);
  });
});

app.listen(3000, () => {
  console.log("Express.js server running at localhost:3000");
});

// get collection name
