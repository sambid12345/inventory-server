import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
const fs = require("fs");
import { generateRandomString } from "../src/utils/tokenGenerator";
import app from "./app";
dotenv.config();

const dbUrl: string = process.env.DB_URL || "";

const port: string = process.env.PORT || "";

const server = http.createServer(app);

// Function to initialize the secret key
async function initializeSecretKey() {
  // Check if the secret key file already exists
  if (!fs.existsSync("jwtsecret.txt")) {
    // If the file doesn't exist, generate a new secret key
    const newSecretKey = generateRandomString(32);
    // Save the new secret key to the file
    await fs.writeFileSync("jwtsecret.txt", newSecretKey);
    console.log("New secret key generated and saved to file.");
  }
}

async function startServer(): Promise<void> {
  try {
    const start = new Date().getTime();
    await mongoose.connect(dbUrl);
    await initializeSecretKey();
    server.listen(port, () => {
      console.log(
        `server started on port ${port} in ${new Date().getTime() - start} ms`
      );
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log("Internal Server Error");
    } else {
      console.log(error, "Error in Connecting DB");
    }
  }
}

startServer();
