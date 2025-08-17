# Airtable Form Builder

This project is a dynamic form builder application that connects to Airtable, allowing users to create forms with conditional logic and save responses directly to Airtable. The application is built using the MERN stack (MongoDB, Express, React, Node.js) and includes user authentication.

## Features

- User authentication (registration and login)
- Form creation with customizable fields and conditional logic
- Saving form responses to Airtable
- Fetching and displaying Airtable bases, tables, and fields

## Project Structure

```
airtable-form-builder
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   └── app.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Airtable account

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd airtable-form-builder
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

### Configuration

- Create a `.env` file in the `backend` directory and add your Airtable API key and base ID.
- Set up your MongoDB connection string in the `.env` file.

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

### Usage

- Access the application in your browser at `http://localhost:5000`.
- Register a new user or log in to access the form builder.
- Create forms and define conditional logic as needed.
- Submit responses to save them in Airtable.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
