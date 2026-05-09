import express from "express";
import {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByPassenger,
    cancelBooking,
    deleteBooking
} from "../controller/bookingController.js";

const route = express.Router();

route.post("/create", createBooking);
route.get("/getallbookings", getAllBookings);
route.get("/getbooking/:id", getBookingById);
route.get("/passenger/:email", getBookingsByPassenger);
route.put("/cancel/:id", cancelBooking);
route.delete("/delete/:id", deleteBooking);

export default route;
