import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { config } from 'dotenv';
import { rateLimiter } from 'hono-rate-limiter';
import { swaggerUI } from '@hono/swagger-ui';

console.log('📦 Loading backend dependencies...');

try {
  // Load environment variables first
  config();
  console.log('✅ Environment variables loaded');

  // Import routes and utilities after env is loaded
  const hiAnimeRoutes = await import('./routes/routes.js').then(m => m.default);
  const { AppError } = await import('./utils/errors.js');
  const { fail } = await import('./utils/response.js');
  const hianimeApiDocs = await import('./utils/swaggerUi.js').then(m => m.default);

  console.log('✅ All dependencies loaded successfully');

  const app = new Hono();

  const origins = process.env.ORIGIN ? process.env.ORIGIN.split(',') : '*';
  console.log(`🌍 CORS origins: ${origins}`);

  // third party middlewares
  app.use(
    '*',
    cors({
      origin: origins,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: '*',
    })
  );

  // Apply the rate limiting middleware to all requests.
  app.use(
    rateLimiter({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
      limit: parseInt(process.env.RATE_LIMIT_LIMIT) || 100,
      standardHeaders: 'draft-6', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      keyGenerator: () => '<unique_key>', // Method to generate custom identifiers for clients.
      // store: ... , // Redis, MemoryStore, etc. See below.
    })
  );

  app.get('/', (c) => {
    console.log('🏠 Root endpoint accessed');
    c.status(200);
    return c.text('welcome to anime API 🎉 start by hitting /api/v1 for documentation');
  });
  
  app.get('/ping', (c) => {
    console.log('🏥 Health check ping received');
    return c.text('pong');
  });

  // Add a simple test endpoint
  app.get('/test', (c) => {
    console.log('🧪 Test endpoint accessed');
    return c.json({
      status: 'ok',
      message: 'Backend is working correctly',
      timestamp: new Date().toISOString(),
      env: {
        node_env: process.env.NODE_ENV,
        port: process.env.PORT,
        origin: process.env.ORIGIN
      }
    });
  });
  
  app.route('/api/v1', hiAnimeRoutes);
  app.get('/doc', (c) => c.json(hianimeApiDocs));

  // Use the middleware to serve Swagger UI at /ui
  app.get('/ui', swaggerUI({ url: '/doc' }));
  
  app.onError((err, c) => {
    console.error('❌ Application error:', err.message);
    if (err instanceof AppError) {
      return fail(c, err.message, err.statusCode, err.details);
    }
    console.error('unexpected Error :' + err.message);

    return fail(c);
  });

  console.log('✅ Application initialized successfully');
  export default app;

} catch (error) {
  console.error('❌ Failed to initialize application:', error);
  console.error('Stack trace:', error.stack);
  throw error;
}
