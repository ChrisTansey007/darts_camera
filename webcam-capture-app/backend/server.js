const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet'); // Added
const rateLimit = require('express-rate-limit'); // Added

const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(helmet()); // Basic security headers
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Rate limiter for upload endpoint
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for /upload
  standardHeaders: true, // Return rate limit info in the \`RateLimit-*\` headers
  legacyHeaders: false, // Disable the \`X-RateLimit-*\` headers
  message: 'Too many uploads from this IP, please try again after 15 minutes.',
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeFilename = path.basename(file.originalname);
    cb(null, `${Date.now()}-${safeFilename}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Example: Limit file size to 10MB
});

// POST endpoint for uploading images
app.post('/upload', uploadLimiter, upload.single('image'), (req, res, next) => { // Added uploadLimiter
  if (req.fileValidationError) { // Custom error from fileFilter if added
    return res.status(400).send({ message: req.fileValidationError });
  }
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// GET endpoint to retrieve all uploaded images
app.get('/images', (req, res, next) => { // Added next for error handling
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Failed to list images:', err);
      // Pass error to the centralized error handler
      return next(new Error('Failed to retrieve images.'));
    }
    const imagePaths = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => `/uploads/${file}`);
    res.send(imagePaths);
  });
});

// Basic Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  // Respond with a generic error message
  // Avoid sending detailed error messages to client in production
  const statusCode = err.status || err.statusCode || 500; // Use error's status or default to 500
  res.status(statusCode).send({
    message: err.message || 'An unexpected error occurred.',
    // Optionally, include error code or type in development
    ...(process.env.NODE_ENV === 'development' && { errorDetails: err.name }),
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
