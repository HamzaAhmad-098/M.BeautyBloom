import express from 'express';
import  dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory (server folder)
dotenv.config({ path: path.join(__dirname, '../.env') });

// Verify it loaded
console.log('Environment check:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Loaded' : '❌ Not loaded',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '✅ Loaded' : '❌ Not loaded',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '✅ Loaded' : '❌ Not loaded',
});
import app from './app.js';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  if (NODE_ENV === 'development') {
    console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  
  // Close server & exit process
  server.close(() => {
    console.log('💥 Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
if (process.env.NODE_ENV === 'production') {
  // Resolve the client build path
  const clientBuildPath = path.resolve(__dirname, '../../client/dist');
  
  console.log('📁 Serving static files from:', clientBuildPath);
  
  // Serve static files
  app.use(express.static(clientBuildPath));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API route not found' });
    }
    
    console.log('🔄 Routing to React app for:', req.path);
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // In development, just serve API
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'API is running in development mode',
      frontend: 'Run on localhost:3000'
    });
  });
}