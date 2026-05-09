import express from "express";
import {
    createBus,
    getAllBuses,
    getBusById,
    searchBuses,
    updateBus,
    deleteBus
} from "../controller/busController.js";

const route = express.Router();

route.post("/create", createBus);
route.get("/getallbuses", getAllBuses);
route.get("/search", searchBuses);
route.get("/getbus/:id", getBusById);
route.put("/update/:id", updateBus);
route.delete("/delete/:id", deleteBus);

export default route;
