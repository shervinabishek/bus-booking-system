import Bus from "../model/busModel.js";

// Create a new bus
export const createBus = async (req, res) => {
    try {
        const busData = new Bus(req.body);
        const { busNumber } = busData;
        const busExist = await Bus.findOne({ busNumber });
        if (busExist) {
            return res.status(400).json({ message: "Bus with this number already exists!" });
        }
        const savedBus = await busData.save();
        res.status(201).json(savedBus);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all buses
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        if (buses.length === 0) {
            return res.status(404).json({ message: "No buses found!" });
        }
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Get a single bus by ID
export const getBusById = async (req, res) => {
    try {
        const id = req.params.id;
        const busExist = await Bus.findById(id);
        if (!busExist) {
            return res.status(404).json({ message: "Bus not found!" });
        }
        res.status(200).json(busExist);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Search buses by from, to, and travelDate
export const searchBuses = async (req, res) => {
    try {
        const { from, to, travelDate } = req.query;
        if (!from || !to || !travelDate) {
            return res.status(400).json({ message: "Please provide from, to, and travelDate query parameters!" });
        }
        const date = new Date(travelDate);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const buses = await Bus.find({
            from: { $regex: from, $options: "i" },
            to: { $regex: to, $options: "i" },
            travelDate: { $gte: date, $lt: nextDay },
            status: "active"
        });
        if (buses.length === 0) {
            return res.status(404).json({ message: "No buses found for this route and date!" });
        }
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Update a bus by ID
export const updateBus = async (req, res) => {
    try {
        const id = req.params.id;
        const busExist = await Bus.findOne({ _id: id });
        if (!busExist) {
            return res.status(404).json({ message: "Bus not found!" });
        }
        const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updatedBus);
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};

// Delete a bus by ID
export const deleteBus = async (req, res) => {
    try {
        const id = req.params.id;
        const busExist = await Bus.findOne({ _id: id });
        if (!busExist) {
            return res.status(404).json({ message: "Bus not found!" });
        }
        await Bus.findByIdAndDelete(id);
        res.status(200).json({ message: "Bus deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error!" });
    }
};
