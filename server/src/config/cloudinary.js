import multer from 'multer';
import cloudinaryPackage from 'cloudinary';
import streamifier from 'streamifier';

const cloudinary = cloudinaryPackage.v2;

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: "dr1rajqzy",
  api_key: "262126185646844",
  api_secret: "6mf1GbLRWK8D0pQEyn3EoJedSuw",
});
// Add after config
console.log('Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key_exists: !!process.env.CLOUDINARY_API_KEY,
  api_secret_exists: !!process.env.CLOUDINARY_API_SECRET
});
// Use memory storage so we can upload buffers directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype) return cb(new Error('File has no mimetype'), false);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

// Helper to upload a buffer to Cloudinary and return the upload result
export const uploadToCloudinary = (fileBuffer, folder = 'beautybloom/products') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });

export default cloudinary;