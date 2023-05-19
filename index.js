const express = require("express");
const port = 8000;
const app = express();
const bodyParser = require("body-parser");

// For parsing req.body("Hello Server. Pase the request body at First")
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require("./config/mongoose");

// Get any request from client look for the index page inside the routes
app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.log("Error in starting the server");
    return;
  }
  console.log(`Server started on port ${port}`);
});
