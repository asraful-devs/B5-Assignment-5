import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { DriverController } from './driver.controller';

const router = express.Router();

router.get(
    '/available-rides',
    checkAuth('DRIVER', 'ADMIN'),
    DriverController.getAvailableRides
);

router.patch(
    '/pick-up-ride/:rideId',
    checkAuth('DRIVER', 'ADMIN'),
    DriverController.pickUpRide
);

router.patch(
    '/update-ride-status/:rideId',
    checkAuth('DRIVER', 'ADMIN'),
    DriverController.updateRideStatus
);

router.get(
    '/my-rides',
    checkAuth('DRIVER', 'ADMIN'),
    DriverController.getMyRides
);

router.get(
    '/daily-earnings',
    checkAuth('DRIVER', 'ADMIN'),
    DriverController.dailyEarningsController
);

export const DriverRoutes = router;
