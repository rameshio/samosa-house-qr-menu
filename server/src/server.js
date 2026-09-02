import app from './app.js';
import { config } from './config/env.js';

const startServer = () => {
  try {
    const server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode.`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${config.port} is already in use. Please choose another port or kill the process.`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
