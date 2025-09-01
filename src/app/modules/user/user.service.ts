import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from '../../error/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';

// create a user service that handles user-related operations
const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exist...');
    }
    if (role === Role.ADMIN) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid role provided. Only RIDER or DRIVER roles are allowed.'
        );
    }
    if (!email || !password) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Email and Password are required'
        );
    }

    const hashedPassword = await bcryptjs.hash(
        password as string,
        Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    const authProvider: IAuthProvider = {
        provider: 'credential',
        providerId: email as string,
    };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        role: role || Role.RIDER,
        ...rest,
    });
    return user;
};

// update user
const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (payload.role) {
        if (
            decodedToken.role === Role.DRIVER ||
            decodedToken.role === Role.RIDER
        ) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
        }

        if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (
            decodedToken.role === Role.DRIVER ||
            decodedToken.role === Role.RIDER
        ) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(
            payload.password,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        );
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return newUpdateUser;
};

// delete user
const deleteUser = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

// get single user
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select('-password');
    return {
        data: user,
    };
};

// get all users
const getAllUsers = async () => {
    const users = await User.find();
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};

const getAllDrivers = async () => {
    const drivers = await User.find({ role: Role.DRIVER });
    const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
    return {
        data: drivers,
        meta: {
            total: totalDrivers,
        },
    };
};
const getAllRiders = async () => {
    const riders = await User.find({ role: Role.RIDER });
    const totalRiders = await User.countDocuments({ role: Role.RIDER });
    return {
        data: riders,
        meta: {
            total: totalRiders,
        },
    };
};

export const UserService = {
    createUser,
    updateUser,
    deleteUser,
    getMe,
    getAllUsers,
    getAllDrivers,
    getAllRiders,
};
