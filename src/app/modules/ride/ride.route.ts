import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequst';
import { RideController } from './ride.controller';
import { createRideZodSchema, updateRideZodSchema } from './ride.validation';

const router = express.Router();

router.post(
    '/create',
    checkAuth('RIDER', 'ADMIN'),
    validateRequest(createRideZodSchema),
    RideController.createRide
);

router.get('/my-rides', checkAuth('RIDER', 'ADMIN'), RideController.getMyRides);

router.patch(
    '/:id',
    checkAuth('RIDER', 'ADMIN', 'DRIVER'),
    validateRequest(updateRideZodSchema),
    RideController.updateRide
);

router.delete(
    '/:id',
    checkAuth('RIDER', 'ADMIN', 'DRIVER'),
    RideController.deleteRide
);

router.get('/stats', checkAuth('RIDER', 'ADMIN'), RideController.getStats);

router.get('/all-rides', checkAuth('ADMIN'), RideController.getAllRides);

export const RideRoutes = router;
