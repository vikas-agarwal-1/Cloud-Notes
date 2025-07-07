import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import noteRoute from "./routes/noteRoute.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const PORT = process.env.PORT || 3002;
const DB_URI = process.env.MONGO_URI;

// Database Connection
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to DataBase");
} catch (err) {
  console.log(err);
}

// Routes
app.use("/auth/api", userRoute);
app.use("/api/note", noteRoute);


app.listen(3004, ()=> {
    console.log(`Server Started at port ${3004}`)
})