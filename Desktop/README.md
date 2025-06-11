# Webcam Capture App - Complete Setup Guide

## 🚀 Quick Start

### 1. Project Setup
```bash
# Create main project directory
mkdir webcam-capture-app
cd webcam-capture-app

# Initialize React app
npx create-react-app . --template typescript
# Or for JavaScript: npx create-react-app .

# Install Electron dependencies
npm install --save-dev electron electron-builder concurrently wait-on
npm install electron-is-dev node-fetch form-data
```

### 2. Backend Setup
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize backend
npm init -y
npm install express multer cors
npm install --save-dev nodemon
```

### 3. File Structure
```
webcam-capture-app/
├── public/
│   ├── electron.js
│   └── preload.js
├── src/
│   └── App.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── uploads/ (created automatically)
├── package.json
└── README.md
```

## 🔧 Advanced Features

### Camera Settings Enhancement
Add to your React component:

```javascript
// Advanced camera configuration
const getCameraDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'videoinput');
};

const startCameraWithDevice = async (deviceId) => {
  const constraints = {
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      frameRate: { ideal: 30, max: 60 }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  videoRef.current.srcObject = stream;
};
```

### Batch Upload Feature
```javascript
const uploadAllImages = async () => {
  setIsUploading(true);
  const results = [];

  for (const image of capturedImages) {
    try {
      const result = await uploadImage(image);
      results.push({ image: image.filename, success: true, result });
    } catch (error) {
      results.push({ image: image.filename, success: false, error: error.message });
    }
  }

  setIsUploading(false);
  console.log('Batch upload results:', results);
};
```

## 🛡️ Security Enhancements

### Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  media-src 'self' blob:;
  connect-src 'self' http://localhost:3001;
">
```

### Backend Authentication
```javascript
// Add to backend server.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protect upload routes
app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  // Upload logic here
});
```

## 📱 Platform-Specific Features

### Windows Integration
```javascript
// In electron.js
const { app, BrowserWindow, Menu, Tray } = require('electron');

let tray = null;

app.whenReady().then(() => {
  // System tray integration
  tray = new Tray('assets/icon.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setContextMenu(contextMenu);
});
```

### macOS Integration
```javascript
// Add to electron.js for macOS-specific features
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'Webcam Capture',
    applicationVersion: '1.0.0',
    copyright: 'Copyright © 2025'
  });
}
```

## 🚢 Production Deployment

### 1. Environment Configuration
Create `.env` files:

**.env.development**:
```
REACT_APP_API_URL=http://localhost:3001
ELECTRON_IS_DEV=true
```

**.env.production**:
```
REACT_APP_API_URL=https://your-api-domain.com
ELECTRON_IS_DEV=false
```

### 2. Build Scripts
Update `package.json`:
```json
{
  "scripts": {
    "build": "react-scripts build",
    "electron-pack": "npm run build && electron-builder",
    "dist": "npm run build && electron-builder --publish=never",
    "deploy": "npm run build && electron-builder --publish=always"
  },
  "build": {
    "appId": "com.yourcompany.webcam-capture",
    "productName": "Webcam Capture",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "node_modules/**/*",
      "public/electron.js",
      "public/preload.js"
    ],
    "mac": {
      "icon": "assets/icon.icns",
      "category": "public.app-category.photography"
    },
    "win": {
      "icon": "assets/icon.ico",
      "target": "nsis"
    },
    "linux": {
      "icon": "assets/icon.png",
      "target": "AppImage"
    }
  }
}
```

### 3. Backend Production Setup
```javascript
// Production server configuration
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/upload', limiter);

// Production settings
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}
```

### 4. Docker Deployment
Create `Dockerfile` for backend:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    volumes:
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=production
```

## 🔍 Testing & Quality Assurance

### Unit Tests
```javascript
// Test camera functionality
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('camera starts when button is clicked', async () => {
  // Mock getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }]
      })
    }
  });

  render(<App />);

  const startButton = screen.getByText('Start Camera');
  await userEvent.click(startButton);

  await waitFor(() => {
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
  });
});
```

### Integration Tests
```javascript
// Test upload functionality
test('image upload to backend works', async () => {
  const mockResponse = { success: true, id: '123' };
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockResponse
  });

  // Test upload logic
  const result = await uploadToBackend(new Uint8Array([1, 2, 3]), 'test.jpg');
  expect(result).toEqual(mockResponse);
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Camera Access Denied**:
   - Check system permissions
   - Restart Electron app
   - Verify camera isn't used by another app

2. **Upload Failures**:
   - Verify backend server is running
   - Check network connectivity
   - Validate image data format

3. **Build Issues**:
   - Clear node_modules and reinstall
   - Check Electron version compatibility
   - Verify all dependencies are installed

### Debug Mode
Enable debug logging:
```javascript
// In electron.js
if (isDev) {
  require('electron-debug')({
    showDevTools: true,
    devToolsMode: 'right'
  });
}
```

## 📈 Performance Optimization

### Image Compression
```javascript
const compressImage = (canvas, quality = 0.8) => {
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
};
```

### Memory Management
```javascript
// Clean up resources
useEffect(() => {
  return () => {
    capturedImages.forEach(image => {
      URL.revokeObjectURL(image.url);
    });
  };
}, [capturedImages]);
```

This complete setup gives you a production-ready webcam capture application that bypasses browser restrictions while maintaining security and providing a great user experience!
