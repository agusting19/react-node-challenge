import { env } from "@/infrastructure/config/environment.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "@/infrastructure/database/connection.js";
import app from "./app.js";
import seedUsers from "./infrastructure/database/seeders/seed.js";

const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();

    // Run seed script
    await seedUsers();

    // Start HTTP server
    const server = app.listen(env.port, () => {
      console.log(`🚀 Trucking API running on port ${env.port}`);
      console.log(`📊 Health check: http://localhost:${env.port}/health`);
      console.log(`📋 API docs: http://localhost:${env.port}/api`);
      console.log(`🌍 Environment: ${env.nodeEnv}`);
      console.log(`👤 Login with: admin@trucking.com / admin123`);
    });

    // Graceful shutdown function
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received - Starting graceful shutdown...`);

      try {
        // Close HTTP Server (stop accepting new connections)
        server.close(async () => {
          console.log("✅ HTTP server closed");

          try {
            // Disconnect database
            await disconnectDatabase();
            console.log("✅ Database disconnected");
            console.log("✅ Graceful shutdown completed");
            process.exit(0);
          } catch (dbError) {
            console.error("❌ Error disconnecting database:", dbError);
            process.exit(1);
          }
        });

        // Force close after 10 seconds
        setTimeout(() => {
          console.error("❌ Forced shutdown after timeout");
          process.exit(1);
        }, 10000);
      } catch (error) {
        console.error("❌ Error during graceful shutdown:", error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    return server;
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
