const express = require("express");
const router = express.Router();
const {
  registerParticipant,
  getRegistrations,
  getEventStats,
  exportRegistrationsCSV,
  initAllEventCollections,
} = require("../controllers/EngineersDayController");

// @route   POST /api/engineers-day/register
// @desc    Register a participant (saves in event's dedicated collection + master collection)
router.post("/register", registerParticipant);

// @route   GET /api/engineers-day/registrations
// @desc    Get all registrations (supports ?event=slug)
router.get("/registrations", getRegistrations);

// @route   GET /api/engineers-day/stats
// @desc    Get total and per-competition registration counts
router.get("/stats", getEventStats);

// @route   GET /api/engineers-day/csv
// @desc    Download registrations in CSV format
router.get("/csv", exportRegistrationsCSV);

// @route   GET /api/engineers-day/init-collections
// @desc    Ensure all 12 collections are created in MongoDB Compass
router.get("/init-collections", initAllEventCollections);

module.exports = router;
