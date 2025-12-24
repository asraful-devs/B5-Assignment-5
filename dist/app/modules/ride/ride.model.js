"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const rideSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver' },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    payment: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.PENDING,
    },
    paymentUrl: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Ride = (0, mongoose_1.model)('Ride', rideSchema);
