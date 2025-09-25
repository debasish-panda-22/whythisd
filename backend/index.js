import app from './src/app.js';
import Bun from 'bun';

console.log('Starting hianime-api backend server...');

try {
  const server = Bun.serve({
    port: 3030,
    hostname: '0.0.0.0',
    fetch: app.fetch,
  });

  console.log(`✅ Server started successfully on port ${server.port}`);
  console.log(`🏥 Health check available at: http://localhost:3030/ping`);
  console.log(`📚 API documentation at: http://localhost:3030/ui`);
  console.log(`🔗 Base API endpoint: http://localhost:3030/api/v1`);
  
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

} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
