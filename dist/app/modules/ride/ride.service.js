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
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const AppError_1 = __importDefault(require("../../error/AppError"));
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
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
    const ride = yield ride_model_1.Ride.create(payload);
    const transactionId = `TRX-${Date.now()}-${(0, uuid_1.v4)()}`;
    let paymentUrl = '';
    // ✅ SSLCommerz থেকে payment URL generate করার চেষ্টা করছি
    try {
        const sslPayload = {
            address: 'N/A',
            email: userData.email,
            phoneNumber: userData.phone || 'N/A',
            name: userData.name,
            amount: ride.payment,
            transactionId: transactionId,
        };
        const sslPayment = yield SSLCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        paymentUrl = sslPayment.GatewayPageURL; // ✅ payment link পেয়েছি
    }
    catch (error) {
        console.log('Warning: Could not generate payment URL:', error);
    }
    const payment = yield payment_model_1.Payment.create({
        ride: ride._id,
        amount: ride.payment,
        transactionId: transactionId,
        status: payment_interface_1.PaymentStatus.UNPAID,
        paymentUrl: paymentUrl,
    });
    return {
        ride: Object.assign(Object.assign({}, ride.toObject()), { paymentUrl }),
        payment: Object.assign({}, payment.toObject()),
    };
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
    const ride = yield ride_model_1.Ride.findById(id);
    if (!ride) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Ride not found!');
    }
    if (ride.status === ride_interface_1.RideStatus.PICKED ||
        ride.status === ride_interface_1.RideStatus.COMPLETED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot update ride when status is ${ride.status}. Update is only allowed in PENDING status.`);
    }
    if (payload.payment && payload.payment !== ride.payment) {
        const userData = yield user_model_1.User.findById(ride.user);
        if (!userData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
        }
        const newTransactionId = `TRX-${Date.now()}-${(0, uuid_1.v4)()}`;
        let newPaymentUrl = '';
        // ✅ নতুন payment amount এর জন্য নতুন payment URL generate করছি
        try {
            const sslPayload = {
                address: 'N/A',
                email: userData.email,
                phoneNumber: userData.phone || 'N/A',
                name: userData.name,
                amount: payload.payment,
                transactionId: newTransactionId,
            };
            const sslPayment = yield SSLCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
            newPaymentUrl = sslPayment.GatewayPageURL;
        }
        catch (error) {
            console.log('Warning: Could not generate new payment URL:', error);
        }
        yield payment_model_1.Payment.deleteOne({ ride: id });
        yield payment_model_1.Payment.create({
            ride: id,
            amount: payload.payment,
            transactionId: newTransactionId,
            status: payment_interface_1.PaymentStatus.UNPAID,
            paymentUrl: newPaymentUrl, // ✅ নতুন payment URL save করছি
        });
    }
    const result = yield ride_model_1.Ride.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteRide = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(id);
    if ((ride === null || ride === void 0 ? void 0 : ride.status) === 'COMPLETED') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete a completed ride!');
    }
    yield payment_model_1.Payment.deleteOne({ ride: id });
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
// ✅ নতুন Function: Driver Ride Complete করার জন্য
// ✅ শুধুমাত্র পেমেন্ট Complete হলেই Driver ride complete করতে পারবে
const completeRideByDriver = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ প্রথমে Ride খুঁজছি
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Ride not found!');
    }
    // ✅ গুরুত্বপূর্ণ চেক: Ride Status PICKED হতে হবে
    // ✅ কারণ Driver তখনই ride complete করতে পারে যখন সে already pick করেছে
    if (ride.status !== ride_interface_1.RideStatus.PICKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot complete ride. Ride must be in PICKED status. Current status: ${ride.status}`);
    }
    // ✅ এখন Payment খুঁজছি - এটি গুরুত্বপূর্ণ
    const payment = yield payment_model_1.Payment.findOne({ ride: rideId });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment record not found for this ride.');
    }
    // ✅ সবচেয়ে গুরুত্বপূর্ণ চেক: Payment PAID হতে হবে
    // ✅ যদি Payment complete না হয় তাহলে Driver ride complete করতে পারবে না
    if (payment.status !== payment_interface_1.PaymentStatus.PAID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Cannot complete ride. Payment status is ${payment.status}. Payment must be completed (PAID) before completing the ride.`);
    }
    // ✅ সব চেক OK - এখন Ride Status COMPLETED এ update করছি
    const result = yield ride_model_1.Ride.findByIdAndUpdate(rideId, { status: ride_interface_1.RideStatus.COMPLETED }, { new: true });
    return result;
});
exports.RideService = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    calculateRideStats,
    getAllRides,
    completeRideByDriver, // ✅ নতুন function যোগ করছি
};
