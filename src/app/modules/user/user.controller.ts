import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserService.createUser(req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Create Successfully',
            data: user,
        });
    }
);

//update user
const updateUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;
        const verifiedToken = req.user;
        const payload = req.body;

        const user = await UserService.updateUser(
            userId,
            payload,
            verifiedToken as JwtPayload
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Update Successfully',
            data: user,
        });
    }
);

// delete user
const deleteUser = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const user = await UserService.deleteUser(userId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User Deleted Successfully',
            data: user,
        });
    }
);

// get single user

const getMe = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const decodedToken = req.user as JwtPayload;
        const result = await UserService.getMe(decodedToken.userId);

        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "All Users Retrieved Successfully",
        //     data: users
        // })
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Your profile Retrieved Successfully',
            data: result,
        });
    }
);

const getAllUsers = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserService.getAllUsers();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'All User Get Successfully',
            data: result.data,
            meta: result.meta,
        });
    }
);

const getAllDrivers = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserService.getAllDrivers();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'All Drivers Get Successfully',
            data: result.data,
            meta: result.meta,
        });
    }
);

const getAllRiders = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await UserService.getAllRiders();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'All Riders Get Successfully',
            data: result.data,
            meta: result.meta,
        });
    }
);

export const UserControllers = {
    createUser,
    updateUser,
    deleteUser,
    getMe,
    getAllUsers,
    getAllDrivers,
    getAllRiders,
};
