# TaskFlow Backend

A backend service built with TypeScript, Express, and MongoDB, providing authentication, email notifications, and more.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm 

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskflow-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000                                     # Port on which the server will run (default: 5000, can be changed if needed)
MONGO_URI=mongodb://localhost:27017/taskflow  # Your MongoDB connection URI (use MongoDB Atlas URI if using cloud MongoDB)
JWT_SECRET=your_jwt_secret                    # A secret string used to sign JWT tokens. Choose a secure string (e.g., 'mysecretkey123')
EMAIL=your_email@example.com                  # Your email address used for sending emails (e.g., 'your_email@example.com')
PASS=your_email_password                      # The password or app-specific password for the email account

```

## Scripts

- `npm run dev` - Start the development server with hot-reload

## Project Structure

```
src/
├── app.ts          # Application entry point
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## Technologies Used

- **TypeScript**: Programming language
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Nodemailer**: Email service
- **bcryptjs**: Password hashing
- **cors**: Cross-Origin Resource Sharing

## API Documentation

[Detailed API documentation to be added]

## Development

1. Make sure MongoDB is running locally
2. Start the development server:
```bash
npm run dev
```
3. The server will be available at `http://localhost:3000`


## License

This project is licensed under the ISC License.
