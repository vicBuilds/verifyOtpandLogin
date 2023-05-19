// Api route(`baseUrl/api/register`)
const express = require("express");

const app = express();

const userController = require("../../../controllers/userController");

const router = express.Router();

// Change the routes to post.
router.post("/", userController.register);

module.exports = router;
