const express = require("express");
const router = express.Router();
const {
  getNearbyHospitals,
} = require("../../controller/hospitalController/hospitalController");


router.post("/nearby", getNearbyHospitals);

module.exports = router;
