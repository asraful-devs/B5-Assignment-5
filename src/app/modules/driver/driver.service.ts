import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { Ride } from '../ride/ride.model';
// import { IDriver } from './driver.interface';
// import { Driver } from './driver.model';

const getAvailableRides = async () => {
    const result = await Ride.find({ status: 'PENDING' });
    return result;
};

const pickUpRide = async (
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any
) => {
    const rideId = req.params.rideId;

    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
    }

    if (ride.status !== 'PENDING') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Ride is not available for pickup'
        );
    }

    if (ride.driver) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Ride is already assigned to another driver'
        );
    }

    // const driver = await Driver.create(payload);
    // console.log(user);

    const result = await Ride.findByIdAndUpdate(
        rideId,
        { status: 'PICKED', driver: user.userId },
        { new: true }
    );
    return result;
};

// const updateRideStatus = async (
//     rideId: string,
//     payload: { status: 'COMPLETED' | 'CANCELLED' }
// ) => {
//     const foundRide = await Ride.findById(rideId);
//     const { status } = payload;
//     if (!foundRide) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
//     }

//     // Prevent updating if already COMPLETED or CANCELLED
//     if (foundRide.status === 'COMPLETED' || foundRide.status === 'CANCELLED') {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `This ride is already ${foundRide.status.toLowerCase()}`
//         );
//     }

//     if (foundRide.status !== 'PICKED') {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Ride is not picked');
//     }

//     // Update status
//     foundRide.status = status as unknown as typeof foundRide.status;
//     const result = await foundRide.save();
//     return result;
// };

const updateRideStatus = async (
    rideId: string,
    payload: { status: 'COMPLETED' | 'CANCELLED' }
) => {
    const foundRide = await Ride.findById(rideId);
    const { status } = payload;
    if (!foundRide) {
        throw new AppError(httpStatus.NOT_FOUND, 'Ride not found');
    }

    if (foundRide.status === 'COMPLETED' || foundRide.status === 'CANCELLED') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `This ride is already ${foundRide.status.toLowerCase()}`
        );
    }

    if (foundRide.status !== 'PICKED') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Ride is not picked');
    }

    foundRide.status = status as unknown as typeof foundRide.status;
    const result = await foundRide.save();
    return result;
};

const getMyRides = async (driverId: string) => {
    const result = await Ride.find({ driver: driverId });
    return result;
};

export const getDailyEarnings = async () => {
    return Ride.aggregate([
        { $match: { status: 'COMPLETED' } },
        {
            $group: {
                _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
                earnings: { $sum: '$payment' },
            },
        },
        { $sort: { _id: 1 } },
    ]);
};

export const DriverService = {
    getAvailableRides,
    pickUpRide,
    updateRideStatus,
    getMyRides,
    getDailyEarnings,
};
