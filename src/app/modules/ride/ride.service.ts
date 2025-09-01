import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import { IRide } from './ride.interface';
import { Ride } from './ride.model';

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
const createRide = async (payload: Partial<IRide> & { user: any }) => {
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

    payload.user = userData._id;

    const result = await Ride.create(payload);
    return result;
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

export const RideService = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    calculateRideStats,
    getAllRides,
};
