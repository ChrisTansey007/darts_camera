const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir)); // Serve static files from uploads

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(file.originalname);
    cb(null, `${Date.now()}-${safeFilename}`);
  }
});

const upload = multer({ storage: storage });

// POST endpoint for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  // Send back the path to the uploaded file
  res.send({ filePath: `/uploads/${req.file.filename}` });
});

// GET endpoint to retrieve all uploaded images
app.get('/images', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Failed to list images:', err);
      return res.status(500).send({ message: 'Failed to retrieve images.' });
    }
    const imagePaths = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)) // Filter for common image extensions
      .map(file => `/uploads/${file}`);
    res.send(imagePaths);
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
