import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Allow requests from the React dev server, with cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Sessions stored in MongoDB so they persist across server restarts
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI as string }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Bitewise API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});