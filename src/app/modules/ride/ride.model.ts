import { Schema, model } from 'mongoose';
import { IRide, RideStatus } from './ride.interface';

const rideSchema = new Schema<IRide>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
        pickupLocation: { type: String, required: true },
        dropLocation: { type: String, required: true },
        payment: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(RideStatus),
            default: RideStatus.PENDING,
        },
        paymentUrl: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Ride = model<IRide>('Ride', rideSchema);
