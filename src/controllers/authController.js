const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/database");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check if user already exists
    db.get(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        if (user) {
          return res.status(409).json({
            message: "Email is already registered"
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.run(
          `
          INSERT INTO users (name, email, password)
          VALUES (?, ?, ?)
          `,
          [name, email, hashedPassword],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "Failed to create user"
              });
            }

            return res.status(201).json({
              message: "User registered successfully",
              user: {
                id: this.lastID,
                name,
                email
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Database error"
          });
        }

        if (!user) {
          return res.status(401).json({
            message: "Invalid email or password"
          });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return res.status(401).json({
            message: "Invalid email or password"
          });
        }

        // Create JWT token
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d"
          }
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};