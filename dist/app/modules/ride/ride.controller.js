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
exports.RideController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ride_service_1 = require("./ride.service");
// const createRide = catchAsync(
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     async (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             throw new Error('User token is missing or invalid.');
//         }
//         const result = await RideService.createRide(req.body);
//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.CREATED,
//             message: 'Ride created successfully',
//             data: result,
//         });
//     }
// );
const createRide = (0, catchAsync_1.default)(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const result = yield ride_service_1.RideService.createRide(Object.assign(Object.assign({}, req.body), { user: req.user }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: 'Ride created successfully',
        data: result,
    });
}));
const getMyRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const result = yield ride_service_1.RideService.getMyRides(req.user);
    const stats = yield ride_service_1.RideService.calculateRideStats(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'My rides retrieved successfully',
        data: {
            rides: result,
            stats,
        },
    });
}));
const updateRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = yield ride_service_1.RideService.updateRide(id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Ride updated successfully',
        data: result,
    });
}));
const deleteRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = yield ride_service_1.RideService.deleteRide(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Ride deleted successfully',
        data: result,
    });
}));
const getStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const result = yield ride_service_1.RideService.calculateRideStats(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Ride stats retrieved successfully',
        data: result,
    });
}));
const getAllRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_service_1.RideService.getAllRides();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'All rides retrieved successfully',
        data: result,
    });
}));
exports.RideController = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    getStats,
    getAllRides,
};
