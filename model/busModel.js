import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: true,
        unique: true
    },
    operator: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    busType: {
        type: String,
        enum: ["AC", "Non-AC", "Sleeper", "Semi-Sleeper"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "completed"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model("buses", busSchema);
