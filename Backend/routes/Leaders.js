const express = require("express");
const leaderController = require("../controllers/LeaderController");
const router = express.Router();

router.get("/", leaderController.getLeaders);

module.exports = router;
