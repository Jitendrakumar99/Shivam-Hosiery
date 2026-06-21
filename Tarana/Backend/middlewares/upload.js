const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Use absolute path for upload directory
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage in memory
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for original upload
  },
});

// Middleware to process images
const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    console.log('No files to process in processImages middleware');
    return next();
  }

  console.log(`Processing ${req.files.length} images...`);
  req.body.images = [];

  try {
    await Promise.all(
      req.files.map(async (file, i) => {
        const filename = `product-${Date.now()}-${i}.webp`;
        const filepath = path.join(uploadDir, filename);

        console.log(`Optimizing image: ${file.originalname} -> ${filename}`);

        // Process with Sharp
        await sharp(file.buffer)
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat('webp')
          .webp({ quality: 60 })
          .toFile(filepath);

        // Add the path to req.body.images (relative to server root)
        req.body.images.push(`/uploads/products/${filename}`);
      })
    );

    console.log('Image processing completed successfully');
    next();
  } catch (error) {
    console.error('Error processing images:', error);
    next(error);
  }
};

module.exports = {
  uploadProducts: upload.array('images', 5), // Up to 5 images
  processImages,
};
