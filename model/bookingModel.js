import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    passengerName: {
        type: String,
        required: true
    },
    passengerEmail: {
        type: String,
        required: true
    },
    passengerPhone: {
        type: String,
        required: true
    },
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "buses",
        required: true
    },
    seatNumber: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }
}, { timestamps: true });

export default mongoose.model("bookings", bookingSchema);
