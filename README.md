# CodeAlpha Event Registration System

A backend REST API for managing events and user registrations, built with Node.js, Express.js, and SQLite.

The system provides user authentication, event management, event registration, capacity control, and registration cancellation.

## Features

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* Create, read, update, and delete events
* Organizer-based event ownership
* Event registration
* Duplicate registration prevention
* Event capacity management
* Registration cancellation
* Re-registration after cancellation
* User registration history
* SQLite database
* CORS support
* Environment variable configuration

## Technologies

* Node.js
* Express.js
* SQLite
* JavaScript
* JWT
* bcryptjs
* CORS
* dotenv
* Postman
* Git & GitHub

## Project Structure

```text
CodeAlpha_EventRegistrationSystem/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── registrationController.js
│   ├── database/
│   │   └── database.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/MoamenAbouhaty/CodeAlpha_EventRegistrationSystem.git
```

Navigate to the project directory:

```bash
cd CodeAlpha_EventRegistrationSystem
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

Do not commit the `.env` file to GitHub.

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The API will run at:

```text
http://localhost:5000
```

## API Endpoints

### Authentication

| Method | Endpoint             | Authentication | Description                        |
| ------ | -------------------- | -------------- | ---------------------------------- |
| POST   | `/api/auth/register` | No             | Register a new user                |
| POST   | `/api/auth/login`    | No             | Login and receive JWT              |
| GET    | `/api/auth/profile`  | Yes            | Get authenticated user information |

### Events

| Method | Endpoint                        | Authentication | Description           |
| ------ | ------------------------------- | -------------- | --------------------- |
| POST   | `/api/events`                   | Yes            | Create an event       |
| GET    | `/api/events`                   | No             | Get all events        |
| GET    | `/api/events/:id`               | No             | Get an event by ID    |
| PUT    | `/api/events/:id`               | Yes            | Update an event       |
| DELETE | `/api/events/:id`               | Yes            | Delete an event       |
| POST   | `/api/events/:eventId/register` | Yes            | Register for an event |

### Registrations

| Method | Endpoint                        | Authentication | Description                          |
| ------ | ------------------------------- | -------------- | ------------------------------------ |
| GET    | `/api/registrations/my`         | Yes            | Get the current user's registrations |
| PATCH  | `/api/registrations/:id/cancel` | Yes            | Cancel a registration                |

## Authentication

Protected endpoints require a JWT access token.

Add the following HTTP header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is returned after a successful login.

## Registration Rules

The API includes several registration rules:

* A user cannot register for the same event more than once while already registered.
* Registration is rejected when the event reaches its capacity.
* A cancelled registration can be activated again.
* Cancelled registrations do not count toward the event capacity.
* Users can only cancel their own registrations.
* Only the event organizer can update or delete their event.

## Database

The application uses SQLite for data persistence.

The database contains:

* `users`
* `events`
* `registrations`

The database file is excluded from Git using `.gitignore`.

## Testing

The API was tested using Postman, including:

* User registration
* User login
* JWT authentication
* Protected routes
* Event creation
* Event retrieval
* Event update
* Event deletion
* Event registration
* Duplicate registration prevention
* Capacity validation
* Registration cancellation
* Re-registration after cancellation
* Registration ownership protection

## License

This project was developed as part of the CodeAlpha Backend Development Internship.