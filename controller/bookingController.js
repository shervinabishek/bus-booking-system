import Booking from "../model/bookingModel.js";
import Bus from "../model/busModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { busId, seatNumber, passengerEmail } = req.body;

        // Check if the bus exists and is active
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ message: "Bus not found!" });
        }
        if (bus.status !== "active") {
            return res.status(400).json({ message: "Bus is not available for booking!" });
        }

        // Check if the seat is already booked
        const seatTaken = await Booking.findOne({ busId, seatNumber, status: "confirmed" });
        if (seatTaken) {
            return res.status(400).json({ message: `Seat ${seatNumber} is already booked on this bus!` });
        }

        // Validate seat number range
        if (seatNumber < 1 || seatNumber > bus.totalSeats) {
            return res.status(400).json({ message: `Seat number must be between 1 and ${bus.totalSeats}!` });
        }

        // Check if no available seats
        if (bus.availableSeats <= 0) {
            return res.status(400).json({ message: "No seats available on this bus!" });
        }

        // Create booking with fare from the bus
        const bookingData = new Booking({ ...req.body, fare: bus.fare });
        const savedBooking = await bookingData.save();

        // Decrease available seats
        await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

        res.status(201).json(savedBooking);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("busId", "busNumber from to travelDate departureTime fare operator");
        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found!" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
    try {
        const id = req.params.id;
        const booking = await Booking.findById(id).populate("busId", "busNumber from to travelDate departureTime fare operator");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found!" });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Get all bookings by passenger email
export const getBookingsByPassenger = async (req, res) => {
    try {
        const { email } = req.params;
        const bookings = await Booking.find({ passengerEmail: email }).populate("busId", "busNumber from to travelDate departureTime fare operator");
        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this passenger!" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Cancel a booking (update status to "cancelled")
export const cancelBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const bookingExist = await Booking.findOne({ _id: id });
        if (!bookingExist) {
            return res.status(404).json({ message: "Booking not found!" });
        }
        if (bookingExist.status === "cancelled") {
            return res.status(400).json({ message: "Booking is already cancelled!" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });

        // Increase available seats back on cancellation
        await Bus.findByIdAndUpdate(bookingExist.busId, { $inc: { availableSeats: 1 } });

        res.status(201).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
    try {
        const id = req.params.id;
        const bookingExist = await Booking.findOne({ _id: id });
        if (!bookingExist) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        // If booking was confirmed, restore the seat
        if (bookingExist.status === "confirmed") {
            await Bus.findByIdAndUpdate(bookingExist.busId, { $inc: { availableSeats: 1 } });
        }

        await Booking.findByIdAndDelete(id);
        res.status(200).json({ message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};
