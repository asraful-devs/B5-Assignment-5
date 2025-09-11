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
exports.RideService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("./ride.model");
// const createRide = async (user: JwtPayload, payload: Partial<IRide>) => {
//     const userData = await User.findOne({ email: user.email });
//     console.log(userData);
//     if (!userData) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//     }
//     payload.user = userData._id;
//     const result = await Ride.create(payload);
//     return result;
// };
// const createRide = async (payload: Partial<IRide>) => {
//     if (!payload.user || !('email' in payload.user)) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'User information is missing in payload!'
//         );
//     }
//     const userData = await User.findOne({
//         email: (payload.user as { email: string }).email,
//     });
//     console.log(userData);
//     if (!userData) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//     }
//     payload.user = userData._id;
//     const result = await Ride.create(payload);
//     return result;
// };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = payload.user) === null || _a === void 0 ? void 0 : _a.email)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User information is missing in payload!');
    }
    const userData = yield user_model_1.User.findOne({ email: payload.user.email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    payload.user = userData._id;
    const result = yield ride_model_1.Ride.create(payload);
    return result;
});
const getMyRides = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield ride_model_1.Ride.find({ user: userData._id });
    const rides = yield ride_model_1.Ride.find({ user: userData._id });
    const totalSpent = rides.reduce((sum, r) => sum + r.payment, 0);
    return {
        totalRides: rides.length,
        totalSpent,
        result,
    };
});
const updateRide = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteRide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(id);
    if ((ride === null || ride === void 0 ? void 0 : ride.status) === 'COMPLETED') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete a completed ride!');
    }
    const result = yield ride_model_1.Ride.findByIdAndDelete(id);
    return result;
});
const calculateRideStats = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield user_model_1.User.findOne({ email: user.email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const rides = yield ride_model_1.Ride.find({ user: userData._id });
    const totalSpent = rides.reduce((sum, r) => sum + r.payment, 0);
    return {
        totalRides: rides.length,
        totalSpent,
    };
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ride_model_1.Ride.find();
    const count = yield ride_model_1.Ride.countDocuments();
    return { result, count };
});
exports.RideService = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    calculateRideStats,
    getAllRides,
};
