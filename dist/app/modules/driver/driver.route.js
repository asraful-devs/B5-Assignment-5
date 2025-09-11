"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const driver_controller_1 = require("./driver.controller");
const router = express_1.default.Router();
router.get('/available-rides', (0, checkAuth_1.checkAuth)('DRIVER', 'ADMIN'), driver_controller_1.DriverController.getAvailableRides);
router.patch('/pick-up-ride/:rideId', (0, checkAuth_1.checkAuth)('DRIVER', 'ADMIN'), driver_controller_1.DriverController.pickUpRide);
router.patch('/update-ride-status/:rideId', (0, checkAuth_1.checkAuth)('DRIVER', 'ADMIN'), driver_controller_1.DriverController.updateRideStatus);
router.get('/my-rides', (0, checkAuth_1.checkAuth)('DRIVER', 'ADMIN'), driver_controller_1.DriverController.getMyRides);
router.get('/daily-earnings', (0, checkAuth_1.checkAuth)('DRIVER', 'ADMIN'), driver_controller_1.DriverController.dailyEarningsController);
exports.DriverRoutes = router;
