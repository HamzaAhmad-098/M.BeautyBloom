import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

// Uploadcare configuration
const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;
const UPLOADCARE_UPLOAD_URL = 'https://upload.uploadcare.com/base/';

// Verify configuration on startup
console.log('🔧 Uploadcare Configuration Check:');
console.log('Public Key:', UPLOADCARE_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
console.log('Secret Key:', UPLOADCARE_SECRET_KEY ? '✅ Set' : '❌ Missing');

if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_SECRET_KEY) {
  console.error('⚠️  WARNING: Uploadcare credentials are missing in .env file!');
  console.error('Please add UPLOADCARE_PUBLIC_KEY and UPLOADCARE_SECRET_KEY to your .env file');
}

// Use memory storage
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload file buffer to Uploadcare
export const uploadToUploadcare = async (fileBuffer, filename = 'image.jpg') => {
  try {
    if (!UPLOADCARE_PUBLIC_KEY || !UPLOADCARE_SECRET_KEY) {
      throw new Error('Uploadcare credentials not configured');
    }

    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
    formData.append('UPLOADCARE_STORE', '1');
    formData.append('file', fileBuffer, filename);

    const response = await axios.post(UPLOADCARE_UPLOAD_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (!response.data || !response.data.file) {
      throw new Error('Upload failed - no file ID returned');
    }

    const fileId = response.data.file;
    const cdnUrl = `https://ucarecdn.com/${fileId}/`;

    console.log('✅ Image uploaded to Uploadcare:', fileId);

    return {
      url: cdnUrl,
      secure_url: cdnUrl,
      public_id: fileId,
      file_id: fileId,
    };
  } catch (error) {
    console.error('Uploadcare upload error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Upload failed');
  }
};

// Delete file from Uploadcare
export const deleteFromUploadcare = async (fileId) => {
  try {
    if (!fileId || !UPLOADCARE_SECRET_KEY) return;

    await axios.delete(`https://api.uploadcare.com/files/${fileId}/`, {
      headers: {
        Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
      },
    });

    console.log('✅ Image deleted from Uploadcare:', fileId);
  } catch (error) {
    console.error('Uploadcare delete error:', error.response?.data || error.message);
  }
};

export default {
  upload,
  uploadToUploadcare,
  deleteFromUploadcare,
};