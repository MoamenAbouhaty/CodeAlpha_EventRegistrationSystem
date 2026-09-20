const express = require("express");

const {
  getMyRegistrations,
  cancelRegistration
} = require("../controllers/registrationController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/my",
  authenticateToken,
  getMyRegistrations
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  cancelRegistration
);

module.exports = router;