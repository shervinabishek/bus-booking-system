import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bus from './model/busModel.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/bus-booking-system";

const seedBuses = [
  {
    busNumber: "NB-1234",
    operator: "Lanka Express",
    from: "Colombo",
    to: "Kandy",
    departureTime: "08:00 AM",
    arrivalTime: "11:30 AM",
    travelDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    totalSeats: 40,
    availableSeats: 40,
    fare: 450,
    busType: "AC",
    status: "active"
  },
  {
    busNumber: "ND-9988",
    operator: "Super Line",
    from: "Colombo",
    to: "Galle",
    departureTime: "06:30 AM",
    arrivalTime: "09:00 AM",
    travelDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    totalSeats: 50,
    availableSeats: 50,
    fare: 350,
    busType: "Non-AC",
    status: "active"
  },
  {
    busNumber: "NC-5544",
    operator: "Kandy Travels",
    from: "Kandy",
    to: "Colombo",
    departureTime: "02:00 PM",
    arrivalTime: "06:00 PM",
    travelDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    totalSeats: 35,
    availableSeats: 35,
    fare: 500,
    busType: "Semi-Sleeper",
    status: "active"
  },
  {
    busNumber: "NA-1122",
    operator: "Southern Tours",
    from: "Galle",
    to: "Matara",
    departureTime: "10:00 AM",
    arrivalTime: "11:30 AM",
    travelDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    totalSeats: 25,
    availableSeats: 25,
    fare: 150,
    busType: "AC",
    status: "active"
  },
  {
    busNumber: "NE-7777",
    operator: "Night Rider",
    from: "Colombo",
    to: "Jaffna",
    departureTime: "09:00 PM",
    arrivalTime: "05:00 AM",
    travelDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    totalSeats: 40,
    availableSeats: 40,
    fare: 1200,
    busType: "Sleeper",
    status: "active"
  }
];

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("Connected to database for seeding.");
    try {
      // Avoid duplicates
      for (let bus of seedBuses) {
        const exists = await Bus.findOne({ busNumber: bus.busNumber });
        if (!exists) {
          await Bus.create(bus);
          console.log(`Seeded bus ${bus.busNumber}`);
        } else {
          console.log(`Bus ${bus.busNumber} already exists`);
        }
      }
      console.log("Seeding complete!");
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => console.error("Database connection failed", err));
