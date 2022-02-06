const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();

const fs = require("fs");
const fsPromises = require("fs/promises");
class Container {
  constructor(id, title, author, price, thumbnail) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.thumbnail = thumbnail;
  }

  static getProducts() {
    const getter = async () => {
      try {
        const data = fsPromises.readFile("./products.json", "utf-8");
        const localBooks = JSON.parse(data);
        return localBooks;
      } catch (error) {
        throw error;
      }
    };
    return getter();
  }
}

app.get("/products", (req, res) => {
  res.json({ products: Container.getProducts() });
});

const connectedServer = app.listen(PORT, () => {
  console.log(`SERVER IS LIVE ON PORT: ${[PORT]}`);
});

connectedServer.on("error", (error) => {
  console.log(error.message);
});
