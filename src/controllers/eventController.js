const db = require("../database/database");

const createEvent = (req, res) => {
  const {
    title,
    description,
    date,
    location,
    capacity
  } = req.body;

  // Validate required fields
  if (!title || !date || !location || !capacity) {
    return res.status(400).json({
      message: "Title, date, location and capacity are required"
    });
  }

  // Validate capacity
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return res.status(400).json({
      message: "Capacity must be a positive integer"
    });
  }

  const organizerId = req.user.id;

  const sql = `
    INSERT INTO events (
      title,
      description,
      date,
      location,
      capacity,
      organizer_id
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      title,
      description || null,
      date,
      location,
      capacity,
      organizerId
    ],
    function (err) {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to create event"
        });
      }

      return res.status(201).json({
        message: "Event created successfully",
        event: {
          id: this.lastID,
          title,
          description: description || null,
          date,
          location,
          capacity,
          organizer_id: organizerId
        }
      });
    }
  );
};
const getAllEvents = (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      description,
      date,
      location,
      capacity,
      organizer_id,
      created_at
    FROM events
    ORDER BY date ASC
  `;

  db.all(sql, [], (err, events) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch events"
      });
    }

    return res.status(200).json({
      events
    });
  });
};

const getEventById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      id,
      title,
      description,
      date,
      location,
      capacity,
      organizer_id,
      created_at
    FROM events
    WHERE id = ?
  `;

  db.get(sql, [id], (err, event) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch event"
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    return res.status(200).json({
      event
    });
  });
};
const updateEvent = (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    location,
    capacity
  } = req.body;

  if (!title || !date || !location || !capacity) {
    return res.status(400).json({
      message: "Title, date, location and capacity are required"
    });
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    return res.status(400).json({
      message: "Capacity must be a positive integer"
    });
  }

  const organizerId = req.user.id;

  const checkSql = `
    SELECT id
    FROM events
    WHERE id = ? AND organizer_id = ?
  `;

  db.get(checkSql, [id, organizerId], (err, event) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found or you are not the organizer"
      });
    }

    const updateSql = `
      UPDATE events
      SET
        title = ?,
        description = ?,
        date = ?,
        location = ?,
        capacity = ?
      WHERE id = ? AND organizer_id = ?
    `;

    db.run(
      updateSql,
      [
        title,
        description || null,
        date,
        location,
        capacity,
        id,
        organizerId
      ],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Failed to update event"
          });
        }

        return res.status(200).json({
          message: "Event updated successfully"
        });
      }
    );
  });
};

const deleteEvent = (req, res) => {
  const { id } = req.params;
  const organizerId = req.user.id;

  const checkSql = `
    SELECT id
    FROM events
    WHERE id = ? AND organizer_id = ?
  `;

  db.get(checkSql, [id, organizerId], (err, event) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    if (!event) {
      return res.status(404).json({
        message: "Event not found or you are not the organizer"
      });
    }

    const deleteSql = `
      DELETE FROM events
      WHERE id = ? AND organizer_id = ?
    `;

    db.run(
      deleteSql,
      [id, organizerId],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Failed to delete event"
          });
        }

        return res.status(200).json({
          message: "Event deleted successfully"
        });
      }
    );
  });
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};