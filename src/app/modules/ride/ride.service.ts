/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import AppError from '../../error/AppError';
import { PaymentStatus } from '../payment/payment.interface';
import { Payment } from '../payment/payment.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IRide, RideStatus } from './ride.interface';
import { Ride } from './ride.model';

const createRide = async (payload: Partial<IRide> & { user: IUser }) => {
    if (!payload.user?.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User information is missing in payload!'
        );
    }

    const userData = await User.findOne({ email: payload.user.email });

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    payload.user = userData._id as any;

    const ride = await Ride.create(payload);

    const payment = await Payment.create({
        ride: ride._id,
        amount: ride.payment,
        transactionId: `TRX-${Date.now()}-${uuid()}`,
        status: PaymentStatus.UNPAID,
    });

    return { ride, payment };
};

const getMyRides = async (user: JwtPayload) => {
    const userData = await User.findOne({ email: user.email });
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    const result = await Ride.find({ user: userData._id });

    const rides = await Ride.find({ user: userData._id });
    const totalSpent = rides.reduce((sum, r) => sum + r.payment, 0);
    return {
        totalRides: rides.length,
        totalSpent,
        result,
    };
};

const updateRide = async (id: string, payload: Partial<IRide>) => {
    const ride = await Ride.findById(id);

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found!');
    }

    if (
        ride.status === RideStatus.PICKED ||
        ride.status === RideStatus.COMPLETED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot update ride when status is ${ride.status}. Update is only allowed in PENDING status.`
        );
    }

    if (payload.payment && payload.payment !== ride.payment) {
        await Payment.deleteOne({ ride: id });

        await Payment.create({
            ride: id,
            amount: payload.payment,
            transactionId: `TRX-${Date.now()}-${uuid()}`,
            status: PaymentStatus.UNPAID,
        });
    }

    const result = await Ride.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const deleteRide = async (id: string) => {
    const ride = await Ride.findById(id);
    if (ride?.status === 'COMPLETED') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot delete a completed ride!'
        );
    }

    await Payment.deleteOne({ ride: id });

    const result = await Ride.findByIdAndDelete(id);
    return result;
};

const calculateRideStats = async (user: JwtPayload) => {
    const userData = await User.findOne({ email: user.email });
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const rides = await Ride.find({ user: userData._id });
    const totalSpent = rides.reduce((sum, r) => sum + r.payment, 0);
    return {
        totalRides: rides.length,
        totalSpent,
    };
};

const getAllRides = async () => {
    const result = await Ride.find();
    const count = await Ride.countDocuments();
    return { result, count };
};

// ✅ নতুন Function: Driver Ride Complete করার জন্য
// ✅ শুধুমাত্র পেমেন্ট Complete হলেই Driver ride complete করতে পারবে
const completeRideByDriver = async (rideId: string) => {
    // ✅ প্রথমে Ride খুঁজছি
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found!');
    }

    // ✅ গুরুত্বপূর্ণ চেক: Ride Status PICKED হতে হবে
    // ✅ কারণ Driver তখনই ride complete করতে পারে যখন সে already pick করেছে
    if (ride.status !== RideStatus.PICKED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot complete ride. Ride must be in PICKED status. Current status: ${ride.status}`
        );
    }

    // ✅ এখন Payment খুঁজছি - এটি গুরুত্বপূর্ণ
    const payment = await Payment.findOne({ ride: rideId });

    if (!payment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Payment record not found for this ride.'
        );
    }

    // ✅ সবচেয়ে গুরুত্বপূর্ণ চেক: Payment PAID হতে হবে
    // ✅ যদি Payment complete না হয় তাহলে Driver ride complete করতে পারবে না
    if (payment.status !== PaymentStatus.PAID) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot complete ride. Payment status is ${payment.status}. Payment must be completed (PAID) before completing the ride.`
        );
    }

    // ✅ সব চেক OK - এখন Ride Status COMPLETED এ update করছি
    const result = await Ride.findByIdAndUpdate(
        rideId,
        { status: RideStatus.COMPLETED },
        { new: true }
    );

    return result;
};

export const RideService = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    calculateRideStats,
    getAllRides,
    completeRideByDriver, // ✅ নতুন function যোগ করছি
};
