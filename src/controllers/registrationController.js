const db = require("../database/database");

const registerForEvent = (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  // Check if event exists
  const eventSql = `
    SELECT id, capacity
    FROM events
    WHERE id = ?
  `;

  db.get(eventSql, [eventId], (err, event) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check existing registration
    const existingSql = `
      SELECT id, status
      FROM registrations
      WHERE user_id = ? AND event_id = ?
    `;

    db.get(existingSql, [userId, eventId], (err, registration) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      // Already registered
      if (registration && registration.status === "registered") {
        return res.status(409).json({
          message: "You are already registered for this event",
        });
      }

      // Check current event capacity
      const countSql = `
        SELECT COUNT(*) AS registered_count
        FROM registrations
        WHERE event_id = ? AND status = 'registered'
      `;

      db.get(countSql, [eventId], (err, result) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Database error",
          });
        }

        if (result.registered_count >= event.capacity) {
          return res.status(400).json({
            message: "Event is full",
          });
        }

        // Re-register after cancellation
        if (registration && registration.status === "cancelled") {
          const updateSql = `
            UPDATE registrations
            SET status = 'registered'
            WHERE id = ? AND user_id = ? AND event_id = ?
          `;

          db.run(
            updateSql,
            [registration.id, userId, eventId],
            function (err) {
              if (err) {
                console.error(err);

                return res.status(500).json({
                  message: "Failed to register for event",
                });
              }

              return res.status(201).json({
                message: "Registered for event successfully",
                registration: {
                  id: registration.id,
                  user_id: userId,
                  event_id: Number(eventId),
                  status: "registered",
                },
              });
            }
          );

          return;
        }

        // Create new registration
        const insertSql = `
          INSERT INTO registrations (
            user_id,
            event_id,
            status
          )
          VALUES (?, ?, 'registered')
        `;

        db.run(insertSql, [userId, eventId], function (err) {
          if (err) {
            console.error(err);

            return res.status(500).json({
              message: "Failed to register for event",
            });
          }

          return res.status(201).json({
            message: "Registered for event successfully",
            registration: {
              id: this.lastID,
              user_id: userId,
              event_id: Number(eventId),
              status: "registered",
            },
          });
        });
      });
    });
  });
};
const getMyRegistrations = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      registrations.id,
      registrations.status,
      registrations.registered_at,
      events.id AS event_id,
      events.title,
      events.description,
      events.date,
      events.location
    FROM registrations
    JOIN events
      ON registrations.event_id = events.id
    WHERE registrations.user_id = ?
    ORDER BY events.date ASC
  `;

  db.all(sql, [userId], (err, registrations) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch registrations",
      });
    }

    return res.status(200).json({
      registrations,
    });
  });
};

const cancelRegistration = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `
    UPDATE registrations
    SET status = 'cancelled'
    WHERE id = ? AND user_id = ? AND status = 'registered'
  `;

  db.run(sql, [id, userId], function (err) {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to cancel registration",
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Registration not found or already cancelled",
      });
    }

    return res.status(200).json({
      message: "Registration cancelled successfully",
    });
  });
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};
