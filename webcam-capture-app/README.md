# Webcam Capture App

A simple application for capturing images from your webcam using React, Electron, and a Node.js backend. This project was initially bootstrapped with Create React App and then configured for Electron.

## Features

*   Display live webcam feed.
*   Select from available camera devices.
*   Capture screenshots from the webcam.
*   View captured screenshots.
*   Backend server for (future) image storage and management.

## Tech Stack

*   **Frontend:** React (with TypeScript), Create React App
*   **Desktop Framework:** Electron
*   **Backend:** Node.js, Express.js
*   **Styling:** CSS Modules
*   **Key Libraries:**
    *   `react-webcam` for webcam access in React.
    *   `electron-is-dev`, `electron-debug` for Electron development.
    *   `multer` for file uploads on the backend.
    *   `helmet`, `express-rate-limit` for backend security.
    *   `concurrently`, `wait-on` for managing development processes.

## Project Structure Overview

```
webcam-capture-app/
├── backend/              # Node.js Express backend
│   ├── uploads/          # Directory for uploaded images (auto-created)
│   ├── package.json
│   └── server.js
├── build/                # React production build (generated)
├── dist/                 # Electron packaged application (generated)
├── node_modules/
├── public/               # Static assets for React app & Electron main process files
│   ├── electron.js       # Electron main process script
│   ├── preload.js        # Electron preload script
│   ├── index.html
│   └── ...
├── src/                  # React application source code
│   ├── App.module.css    # Styles for App component
│   ├── App.tsx           # Main React App component
│   └── ...
├── .env.development      # (Optional) Environment variables for development
├── .env.production       # (Optional) Environment variables for production
├── camera_code.txt       # Original setup guide with more details
├── package.json          # Root (frontend & Electron) package configuration
└── README.md             # This file
```

## Setup Instructions

1.  **Clone the repository.**
2.  **Install Root Dependencies:**
    Navigate to the project root (`webcam-capture-app/`) and run:
    ```bash
    npm install
    ```
3.  **Install Backend Dependencies:**
    Navigate to the backend directory (`webcam-capture-app/backend/`) and run:
    ```bash
    npm install
    ```
    *(Note: In some sandboxed execution environments, `npm install` might time out. The `package.json` files correctly list all dependencies.)*

## Development Mode

To run the application in development mode (with live reload for frontend and backend):

From the project root (`webcam-capture-app/`):
```bash
npm run electron:dev
```
This command concurrently:
*   Starts the React development server (on http://localhost:3000).
*   Starts the Node.js backend server (on http://localhost:3001, with `nodemon`).
*   Starts the Electron application once both servers are ready.

### Running Backend Separately (Optional)

If you need to run only the backend server:
Navigate to `webcam-capture-app/backend/`:
```bash
npm start
```

## Building for Production

To build the React app and package the Electron application for your current platform:

From the project root (`webcam-capture-app/`):
```bash
npm run electron:build
```
The packaged application will be found in the `dist/` directory.

## Linting

To check for code quality issues in the frontend:
```bash
npm run lint
```

## Further Details

For more advanced features, deployment options (like Docker), testing strategies, and troubleshooting, please refer to the `camera_code.txt` file included in this repository. That file served as the initial comprehensive guide for setting up this project.
