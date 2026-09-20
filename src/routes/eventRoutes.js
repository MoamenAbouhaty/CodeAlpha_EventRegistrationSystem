const express = require("express");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const {
  registerForEvent
} = require("../controllers/registrationController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createEvent);

router.get("/", getAllEvents);



router.get("/:id", getEventById);

router.put("/:id", authenticateToken, updateEvent);

router.delete("/:id", authenticateToken, deleteEvent);

router.post(
  "/:eventId/register",
  authenticateToken,
  registerForEvent
);

module.exports = router;