import { env } from './config/env.js'; // Validates on import
import { testDatabaseConnection } from './database/connection.js';
import { runMigrations } from './database/migrate.js';
import { app } from './app.js';

async function startServer() {
  try {
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      process.exit(1);
    }

    await runMigrations();
    const { seed } = await import('./database/seed.js');
    await seed();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutting down server gracefully...');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
