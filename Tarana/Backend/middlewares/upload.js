const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Use absolute path for upload directory
const productUploadDir = path.join(__dirname, '..', 'uploads', 'products');
const clientUploadDir = path.join(__dirname, '..', 'uploads', 'clients');

[productUploadDir, clientUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

// Middleware to process single client logo
const processClientLogo = async (req, res, next) => {
  if (!req.file) {
    console.log('No logo file to process');
    return next();
  }

  try {
    const filename = `client-${Date.now()}.webp`;
    const filepath = path.join(clientUploadDir, filename);

    console.log(`Optimizing client logo: ${req.file.originalname} -> ${filename}`);

    // Process with Sharp
    await sharp(req.file.buffer)
      .resize(400, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(filepath);

    // Set the path in req.body.logo (relative to server root)
    req.body.logo = `/uploads/clients/${filename}`;
    
    console.log('Client logo processing completed successfully');
    next();
  } catch (error) {
    console.error('Error processing client logo:', error);
    next(error);
  }
};

module.exports = {
  uploadProducts: upload.array('images', 5), // Up to 5 images
  uploadClientLogo: upload.single('logo'),
  processImages,
  processClientLogo,
};
