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
exports.PaymentService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_interface_1 = require("../ride/ride.interface");
const ride_model_1 = require("../ride/ride.model");
const SSLCommerz_service_1 = require("../SSLCommerz/SSLCommerz.service");
const user_model_1 = require("../user/user.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
// const initPayment = async (rideId: string) => {
//     const ride = await Ride.findById(rideId);
//     if (!ride) {
//         throw new AppError(
//             httpStatus.NOT_FOUND,
//             'Ride not found. Unable to process payment.'
//         );
//     }
//     if (ride.status !== RideStatus.PICKED) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `Payment can only be initiated when ride status is PICKED. Current status: ${ride.status}`
//         );
//     }
//     const payment = await Payment.findOne({ ride: rideId });
//     if (!payment) {
//         throw new AppError(
//             httpStatus.NOT_FOUND,
//             'Payment record not found for this ride.'
//         );
//     }
//     if (payment.status === PaymentStatus.PAID) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Payment for this ride has already been completed.'
//         );
//     }
//     const userData = await User.findById(ride.user);
//     if (!userData) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User information not found.');
//     }
//     const sslPayload: ISSLCommerz = {
//         address: userData.address || 'N/A',
//         email: userData.email,
//         phoneNumber: userData.phone || 'N/A',
//         name: userData.name,
//         amount: payment.amount,
//         transactionId: payment.transactionId,
//     };
//     const sslPayment = await SSLService.sslPaymentInit(sslPayload);
//     return {
//         paymentUrl: sslPayment.GatewayPageURL,
//     };
// };
const initPayment = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Ride not found. Unable to process payment.');
    }
    if (ride.status !== ride_interface_1.RideStatus.PICKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Payment can only be initiated when ride status is PICKED. Current status: ${ride.status}`);
    }
    const payment = yield payment_model_1.Payment.findOne({ ride: rideId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Payment record not found for this ride.');
    }
    if (payment.status === payment_interface_1.PaymentStatus.PAID) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Payment for this ride has already been completed.');
    }
    // ✅ যদি paymentUrl ইতিমধ্যে save থাকে, সেটা return করুন
    if (payment.paymentUrl) {
        console.log('✅ Using existing paymentUrl:', payment.paymentUrl);
        return {
            paymentUrl: payment.paymentUrl,
        };
    }
    // ✅ নাহলে নতুন করে generate করুন এবং save করুন
    const userData = yield user_model_1.User.findById(ride.user);
    if (!userData) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User information not found.');
    }
    const sslPayload = {
        address: 'N/A',
        email: userData.email,
        phoneNumber: userData.phone || 'N/A',
        name: userData.name,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };
    const sslPayment = yield SSLCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
    const paymentUrl = sslPayment.GatewayPageURL;
    // ✅ Database এ save করুন যাতে পরবর্তীতে reuse করতে পারেন
    const updatedPayment = yield payment_model_1.Payment.findByIdAndUpdate(payment._id, { paymentUrl }, { new: true });
    if (!updatedPayment) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to update payment record.');
    }
    return {
        paymentUrl: updatedPayment.paymentUrl,
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.PAID,
        }, { new: true, runValidators: true, session: session });
        if (!updatedPayment) {
            throw new AppError_1.default(401, 'Payment record not found.');
        }
        // ✅ গুরুত্বপূর্ণ: এখানে Ride Status COMPLETED করছি না
        // ✅ কারণ: Payment complete হওয়ার পরে Driver নিজেই Ride complete করবে
        // ✅ Driver এর side থেকে একটি separate function থাকবে যা
        //    Payment Status check করবে এবং তারপর Ride complete করবে
        // ✅ যদি Payment complete না হয় তাহলে Driver complete করতে পারবে না
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: 'Payment Completed Successfully. Driver will now complete the ride.',
            payment: updatedPayment,
            // ✅ Ride এর status এখনও PICKED থাকবে - Driver এর জন্য অপেক্ষায়
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.FAILED,
        }, { new: true, runValidators: true, session: session });
        if (!updatedPayment) {
            throw new AppError_1.default(401, 'Payment record not found.');
        }
        yield ride_model_1.Ride.findByIdAndUpdate(updatedPayment.ride, { status: ride_interface_1.RideStatus.PENDING }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: 'Payment Failed. Please try again.',
            payment: updatedPayment,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PaymentStatus.CANCELLED,
        }, { runValidators: true, session: session });
        if (!updatedPayment) {
            throw new AppError_1.default(401, 'Payment record not found.');
        }
        yield ride_model_1.Ride.findByIdAndUpdate(updatedPayment.ride, { status: ride_interface_1.RideStatus.PENDING }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: 'Payment Cancelled',
            payment: updatedPayment,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
