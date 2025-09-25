import Bun from 'bun';

console.log('🚀 Starting hianime-api backend server...');
console.log(`📋 Environment - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📋 Environment - PORT: ${process.env.PORT}`);
console.log(`📋 Environment - HOSTNAME: ${process.env.HOSTNAME}`);

// Simple test app that doesn't depend on complex imports
const simpleApp = {
  fetch: (request) => {
    const url = new URL(request.url);
    
    if (url.pathname === '/ping') {
      console.log('🏥 Health check ping received');
      return new Response('pong', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    if (url.pathname === '/test') {
      console.log('🧪 Test endpoint accessed');
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'Simple backend is working correctly',
        timestamp: new Date().toISOString(),
        env: {
          node_env: process.env.NODE_ENV,
          port: process.env.PORT,
          hostname: process.env.HOSTNAME
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/') {
      console.log('🏠 Root endpoint accessed');
      return new Response('Simple backend server is running 🎉', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};

try {
  const port = parseInt(process.env.PORT) || 3030;
  const hostname = process.env.HOSTNAME || '0.0.0.0';
  
  console.log(`🔧 Attempting to start server on ${hostname}:${port}`);

  const server = Bun.serve({
    port: port,
    hostname: hostname,
    fetch: simpleApp.fetch,
  });

  console.log(`✅ Server started successfully on port ${server.port}`);
  console.log(`🏥 Health check available at: http://localhost:${port}/ping`);
  console.log(`🧪 Test endpoint available at: http://localhost:${port}/test`);
  console.log(`🏠 Root endpoint available at: http://localhost:${port}/`);
  
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
