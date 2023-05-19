const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://victormitra:JICaV4O53mJ2iiLQ@cluster0.4fznd6f.mongodb.net/`
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("There are some isssues connecting to the Database", err);
  });
