// import libraries required
import express from "express";
import mongoose from "mongoose";
import sessionRouter from "./routes/sessionRouter.js";
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import dotenv from "dotenv";

dotenv.config();

// initialize server instance like app
const app = express()

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

// add routes 
app.use("/api/session", sessionRouter)

// main route
app.get("/", (req, res) => [
    res.send("Server running")
])

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
})

