import prisma from "./prismaClient";

class DatabaseService {
  private isConnected = false;

  /**
   * Connect to the database
   */
  async connect(): Promise<void> {
    try {
      await prisma.$connect();
      this.isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      this.isConnected = false;
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
      this.isConnected = false;
      console.log("Database disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect from database:", error);
      throw error;
    }
  }

  /**
   * Check database connection health
   */
  async healthCheck(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { 
        success: true, 
        message: "Database connection is healthy" 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: "Database connection failed", 
        error: error.message 
      };
    }
  }

  /**
   * Get current connection status
   */
  getStatus(): "connected" | "disconnected" {
    return this.isConnected ? "connected" : "disconnected";
  }

  /**
   * Get Prisma client instance
   */
  getClient() {
    return prisma;
  }
}

export default new DatabaseService();