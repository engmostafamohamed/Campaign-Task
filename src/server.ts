import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { DatabaseService } from "./config/database";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Start the application server
 */
async function startServer() {
  try {
    // Connect to database
    console.log("Connecting to MySQL database...");
    await DatabaseService.connect();

    // Perform health check
    const healthCheck = await DatabaseService.healthCheck();
    if (!healthCheck.success) {
      throw new Error(`Database health check failed: ${healthCheck.error}`);
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`✓ Server running in ${NODE_ENV} mode`);
      console.log(`✓ Server URL: http://localhost:${PORT}`);
      console.log(`✓ Database: ${DatabaseService.getStatus()}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    await DatabaseService.disconnect();
    process.exit(1);
  }
}

startServer();