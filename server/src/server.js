import app from './app.js';
import pool from './config/db.js';
import { config } from './config/env.js';

// Start the HTTP server even if MySQL is temporarily unavailable so health checks can report it.
const server = app.listen(config.port, () => {
  console.log(`skill2career API listening on http://localhost:${config.port}`);
});

// Stop accepting requests before releasing the database pool on shutdown.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close(async (error) => {
      try {
        await pool.end();
        if (error) {
          console.error('Error while closing the HTTP server:', error);
          process.exitCode = 1;
        }
      } catch (poolError) {
        console.error('Error while closing the database pool:', poolError);
        process.exitCode = 1;
      }
    });
  });
}
