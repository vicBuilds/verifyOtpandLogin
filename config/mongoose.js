const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4fznd6f.mongodb.net/`
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("There are some isssues connecting to the Database", err);
  });
