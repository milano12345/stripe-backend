const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
if (process.env.NODE_ENV !== "production") {
  dotenv = require("dotenv");
  dotenv.config();
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const fs = require("fs");

server.set("view engine", "ejs");
// rnapp.set("views", path.join(__dirname, "views"));
//server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.static("public"));

server.get("/", (req, res) => {
  res.status(200).json({ api: "running" });
});

server.get("/hello", (req, res) => {
  console.log("server is running");
});

server.get("/store", (req, res) => {
  fs.readFile("items.json", function(error, data) {
    if (error) {
      res.status(500).end();
    } else {
      res.render("store.ejs", {
        items: JSON.parse(data),
        stripePublicKey: stripePublicKey
      });
    }
  });
});

server.post("/purchase", (req, res) => {
  fs.readFile("items.json", function(error, data) {
    if (error) {
      res
        .status(500)
        .json({ message: "error" })
        .end();
    } else {
      console.log("purchased");
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.music.concat(itemsJson.merch);
      let total = 0;
      req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
          return i.id == item.id;
        });
        total = total + itemJson.price * item.quantity;
      });
    }
  });
});

module.exports = server;
