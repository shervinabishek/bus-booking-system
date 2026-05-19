# 🚌 Online Bus Seat Booking System

## Problem Description

Public bus travel in Sri Lanka and many developing countries faces a major challenge: passengers must physically visit bus stations or rely on informal networks to check availability and reserve seats. This leads to overbooking, long queues, and uncertainty for travelers — especially for long-distance routes.

## Proposed Solution

An **Online Bus Seat Booking System** that allows passengers to search for available buses by route and date, view seat availability, and book seats in real time. Bus operators can manage their fleet, update schedules, and track bookings through a structured REST API.

## Target Users
- **Passengers** — Search buses and book seats online
- **Bus Operators** — Manage bus schedules and view bookings

## Features

- Add, update, and delete buses with full schedule info
- Search buses by origin, destination, and travel date
- Real-time seat availability tracking
- Create, view, and cancel passenger bookings
- Duplicate seat booking prevention
- Seat count auto-updates on booking and cancellation
- Error handling and input validation throughout

## Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| React | UI Library |
| Vite | Build tool and dev server |
| React Router DOM | Client-side routing |
| Axios | HTTP client for API requests |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework / REST API |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| dotenv | Environment variable management |
| nodemon | Auto-restart during development |
| Postman | API testing |

---

## Project Structure

```
bus-booking-system/
│
├── frontend/                # React Vite application
│   ├── src/                 # React components and pages
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── model/
│   ├── busModel.js          # Bus schema & model
│   └── bookingModel.js      # Booking schema & model
│
├── controller/
│   ├── busController.js     # Bus CRUD logic
│   └── bookingController.js # Booking CRUD logic
│
├── routes/
│   ├── busRoute.js          # Bus API routes
│   └── bookingRoute.js      # Booking API routes
│
├── .env                     # Environment variables
├── index.js                 # App entry point
├── package.json
└── README.md
```

---

## API Endpoints

### 🚌 Bus Endpoints — Base URL: `/api/buses`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create` | Add a new bus |
| GET | `/getallbuses` | Get all buses |
| GET | `/getbus/:id` | Get a bus by ID |
| GET | `/search?from=&to=&travelDate=` | Search buses by route & date |
| PUT | `/update/:id` | Update bus details |
| DELETE | `/delete/:id` | Delete a bus |

#### POST `/api/buses/create` — Example Body
```json
{
  "busNumber": "NB-1234",
  "operator": "Lanka Express",
  "from": "Colombo",
  "to": "Kandy",
  "departureTime": "08:00 AM",
  "arrivalTime": "11:30 AM",
  "travelDate": "2025-06-15",
  "totalSeats": 40,
  "availableSeats": 40,
  "fare": 350,
  "busType": "AC"
}
```

#### GET `/api/buses/search` — Example
```
GET /api/buses/search?from=Colombo&to=Kandy&travelDate=2025-06-15
```

---

### 🎫 Booking Endpoints — Base URL: `/api/bookings`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create` | Create a new booking |
| GET | `/getallbookings` | Get all bookings |
| GET | `/getbooking/:id` | Get a booking by ID |
| GET | `/passenger/:email` | Get all bookings by passenger email |
| PUT | `/cancel/:id` | Cancel a booking |
| DELETE | `/delete/:id` | Delete a booking |

#### POST `/api/bookings/create` — Example Body
```json
{
  "passengerName": "Kamal Perera",
  "passengerEmail": "kamal@example.com",
  "passengerPhone": "0771234567",
  "busId": "<valid_bus_object_id>",
  "seatNumber": 12
}
```

> **Note:** `fare` is automatically pulled from the bus record — no need to include it in the request body.

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or above)
- MongoDB (running locally or MongoDB Atlas URI)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bus-booking-system
   ```

2. **Backend Setup**
   ```bash
   # Install backend dependencies
   npm install
   ```

   Edit the `.env` file in the root folder:
   ```
   PORT = 8000
   MONGO_URL = "mongodb://localhost:27017/bus-booking-system"
   ```
   *(For MongoDB Atlas, replace the `MONGO_URL` with your Atlas connection string.)*

   ```bash
   # Run the backend server
   npm start
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   
   # Install frontend dependencies
   npm install
   
   # Run the frontend development server
   npm run dev
   ```

4. **Access the Application**
   - **Frontend UI:** `http://localhost:5173`
   - **Backend API:** `http://localhost:8000`

---

## How to Run the Project

1. Ensure MongoDB is running locally (`mongod` service) or use an Atlas connection.
2. In the root directory, run `npm start` to start the backend API.
3. In the `frontend` directory, run `npm run dev` to start the React UI.
4. Access the web app in your browser at `http://localhost:5173`.

---

## Database Collections

### `buses`
| Field | Type | Required |
|---|---|---|
| busNumber | String | ✅ (unique) |
| operator | String | ✅ |
| from | String | ✅ |
| to | String | ✅ |
| departureTime | String | ✅ |
| arrivalTime | String | ✅ |
| travelDate | Date | ✅ |
| totalSeats | Number | ✅ |
| availableSeats | Number | ✅ |
| fare | Number | ✅ |
| busType | Enum (AC / Non-AC / Sleeper / Semi-Sleeper) | ✅ |
| status | Enum (active / cancelled / completed) | default: active |

### `bookings`
| Field | Type | Required |
|---|---|---|
| passengerName | String | ✅ |
| passengerEmail | String | ✅ |
| passengerPhone | String | ✅ |
| busId | ObjectId (ref: buses) | ✅ |
| seatNumber | Number | ✅ |
| bookingDate | Date | default: now |
| fare | Number | auto from bus |
| status | Enum (confirmed / cancelled) | default: confirmed |
