"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequst_1 = __importDefault(require("../../middlewares/validateRequst"));
const ride_controller_1 = require("./ride.controller");
const ride_validation_1 = require("./ride.validation");
const router = express_1.default.Router();
router.post('/create', (0, checkAuth_1.checkAuth)('RIDER', 'ADMIN'), (0, validateRequst_1.default)(ride_validation_1.createRideZodSchema), ride_controller_1.RideController.createRide);
router.get('/my-rides', (0, checkAuth_1.checkAuth)('RIDER', 'ADMIN'), ride_controller_1.RideController.getMyRides);
router.patch('/:id', (0, checkAuth_1.checkAuth)('RIDER', 'ADMIN', 'DRIVER'), (0, validateRequst_1.default)(ride_validation_1.updateRideZodSchema), ride_controller_1.RideController.updateRide);
router.delete('/:id', (0, checkAuth_1.checkAuth)('RIDER', 'ADMIN', 'DRIVER'), ride_controller_1.RideController.deleteRide);
router.get('/stats', (0, checkAuth_1.checkAuth)('RIDER', 'ADMIN'), ride_controller_1.RideController.getStats);
router.get('/all-rides', (0, checkAuth_1.checkAuth)('ADMIN'), ride_controller_1.RideController.getAllRides);
exports.RideRoutes = router;
