import Bun from 'bun';
import app from './src/app.js';

console.log('🚀 Starting hianime-api backend server...');
console.log(`📋 Environment - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📋 Environment - PORT: ${process.env.PORT}`);
console.log(`📋 Environment - HOSTNAME: ${process.env.HOSTNAME}`);

try {
  const port = parseInt(process.env.PORT) || 3030;
  const hostname = process.env.HOSTNAME || '0.0.0.0';
  
  console.log(`🔧 Attempting to start server on ${hostname}:${port}`);

  const server = Bun.serve({
    port: port,
    hostname: hostname,
    fetch: app.fetch,
  });

  console.log(`✅ Server started successfully on port ${server.port}`);
  console.log(`🏥 Health check available at: http://localhost:${port}/ping`);
  console.log(`🧪 Test endpoint available at: http://localhost:${port}/test`);
  console.log(`🏠 Root endpoint available at: http://localhost:${port}/`);
  console.log(`📖 API documentation available at: http://localhost:${port}/ui`);
  console.log(`🔗 API endpoints available at: http://localhost:${port}/api/v1`);
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    server.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    server.stop();
    process.exit(0);
  });

  // Keep the process alive
  console.log('🟢 Server is running and ready to accept connections');

} catch (error) {
  console.error('❌ Failed to start server:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
