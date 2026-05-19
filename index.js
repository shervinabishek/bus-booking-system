import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import busRoute from "./routes/busRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    }).catch((error) => console.log(error));

app.use('/api/buses', busRoute);
app.use('/api/bookings', bookingRoute);
