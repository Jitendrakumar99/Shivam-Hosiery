const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./config/database");
const { errorHandler } = require("./middlewares/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Static files
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const customizationRoutes = require('./routes/customizationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const brandRoutes = require('./routes/brandRoutes');
const clientRoutes = require('./routes/clientRoutes');
const deliveryZoneRoutes = require('./routes/deliveryZoneRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const testRoutes = require('./routes/testRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/customizations', customizationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/delivery-zones', deliveryZoneRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/test', testRoutes);

// File upload configuration (use same absolute dir as static serving)
const uploadPath = uploadDir;
const fs = require('fs');
if (!fs.existsSync(uploadPath)) {
  try {
    fs.mkdirSync(uploadPath, { recursive: true });
  } catch (err) {
    console.error("Failed to create upload directory:", err);
  }
}

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024; // 15MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// File upload route
app.post("/api/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large. Maximum size is 15MB.'
          : `Upload error: ${err.message}`;
      return res.status(400).json({
        success: false,
        message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Upload failed',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    res.json({
      success: true,
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      }
    });
  });
});

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Traan Safety API is running",
    version: "1.0.0"
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
