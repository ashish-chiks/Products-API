const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const router = require("./routes/products");

require("dotenv").config();
require("express-async-errors");
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use("/api/v1/products", router);

app.get("/", (req, res) => {
  res.send("<h3>Go to <a href='/api/v1/products'>Products Page</a></h3>");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to db....");
    app.listen(port, console.log(`server is listening at port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
