import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import app from './app'
dotenv.config();

const dbUrl: string = process.env.DB_URL || ''

const port : string = process.env.PORT || '';

const server = http.createServer(app);

async function startServer(): Promise<void> {
  try {
    const start = new Date().getTime();
    await mongoose.connect(dbUrl);
    server.listen(port, () => {
      console.log(
        `server started on port ${port} in ${new Date().getTime() - start} ms`
      );
    });
  } catch (error) {
    console.log(error, "Error in Connecting DB");
  }
}

startServer();
