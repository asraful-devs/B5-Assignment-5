import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RideService } from './ride.service';

// const createRide = catchAsync(
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     async (req: Request, res: Response, next: NextFunction) => {
//         if (!req.user) {
//             throw new Error('User token is missing or invalid.');
//         }
//         const result = await RideService.createRide(req.body);
//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.CREATED,
//             message: 'Ride created successfully',
//             data: result,
//         });
//     }
// );

const createRide = catchAsync(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new Error('User token is missing or invalid.');
        }

        const result = await RideService.createRide({
            ...req.body,
            user: req.user,
        });

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Ride created successfully',
            data: result,
        });
    }
);

const getMyRides = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const result = await RideService.getMyRides(req.user as JwtPayload);
    const stats = await RideService.calculateRideStats(req.user as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'My rides retrieved successfully',
        data: {
            rides: result,
            stats,
        },
    });
});

const updateRide = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await RideService.updateRide(id, req.body as any);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Ride updated successfully',
        data: result,
    });
});

const deleteRide = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await RideService.deleteRide(id as any);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Ride deleted successfully',
        data: result,
    });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }
    const result = await RideService.calculateRideStats(req.user as JwtPayload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Ride stats retrieved successfully',
        data: result,
    });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
    const result = await RideService.getAllRides();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All rides retrieved successfully',
        data: result,
    });
});

export const RideController = {
    createRide,
    getMyRides,
    updateRide,
    deleteRide,
    getStats,
    getAllRides,
};
