import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DriverService } from './driver.service';

const getAvailableRides = catchAsync(async (req: Request, res: Response) => {
    const result = await DriverService.getAvailableRides();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Available rides retrieved successfully',
        data: result,
    });
});

const pickUpRide = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }

    const { rideId } = req.params;

    if (!rideId) {
        throw new Error('Ride ID is required.');
    }

    if (!rideId) {
        throw new Error('Ride ID is required.');
    }

    const result = await DriverService.pickUpRide(req, res, req.user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Ride picked up successfully',
        data: result,
    });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
    const { rideId } = req.params;
    const payload = req.body;

    // console.log('🚀 rideId:', rideId);
    // console.log('🚀 raw body:', req.body);
    // console.log('🚀 payload:', payload);

    const result = await DriverService.updateRideStatus(rideId, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Ride status updated successfully',
        data: result,
    });
});

const getMyRides = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new Error('User token is missing or invalid.');
    }

    // console.log(req.user);

    // Type assertion to extend req.user with userId property
    const user = req.user as { userId: string };

    if (!user.userId) {
        throw new Error('User ID is missing.');
    }

    const result = await DriverService.getMyRides(user.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'My rides retrieved successfully',
        data: result,
    });
});

export const dailyEarningsController = async (req: Request, res: Response) => {
    try {
        const earnings = await DriverService.getDailyEarnings();
        res.json({ success: true, data: earnings });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching earnings',
            error,
        });
    }
};

export const DriverController = {
    getAvailableRides,
    pickUpRide,
    updateRideStatus,
    getMyRides,
    dailyEarningsController,
};
