"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = exports.dailyEarningsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const driver_service_1 = require("./driver.service");
const getAvailableRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.getAvailableRides();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Available rides retrieved successfully',
        data: result,
    });
}));
const pickUpRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const { rideId } = req.params;
    if (!rideId) {
        throw new Error('Ride ID is required.');
    }
    if (!rideId) {
        throw new Error('Ride ID is required.');
    }
    const result = yield driver_service_1.DriverService.pickUpRide(req, res, req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Ride picked up successfully',
        data: result,
    });
}));
const updateRideStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const payload = req.body;
    // console.log('🚀 rideId:', rideId);
    // console.log('🚀 raw body:', req.body);
    // console.log('🚀 payload:', payload);
    const result = yield driver_service_1.DriverService.updateRideStatus(rideId, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Ride status updated successfully',
        data: result,
    });
}));
const getMyRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    // console.log(req.user);
    // Type assertion to extend req.user with userId property
    const user = req.user;
    if (!user.userId) {
        throw new Error('User ID is missing.');
    }
    const result = yield driver_service_1.DriverService.getMyRides(user.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'My rides retrieved successfully',
        data: result,
    });
}));
const dailyEarningsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const earnings = yield driver_service_1.DriverService.getDailyEarnings();
        res.json({ success: true, data: earnings });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching earnings',
            error,
        });
    }
});
exports.dailyEarningsController = dailyEarningsController;
exports.DriverController = {
    getAvailableRides,
    pickUpRide,
    updateRideStatus,
    getMyRides,
    dailyEarningsController: exports.dailyEarningsController,
};
