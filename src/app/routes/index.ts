import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ContactRoutes } from '../modules/contact/contact.routes';
import { DriverRoutes } from '../modules/driver/driver.route';
import { RideRoutes } from '../modules/ride/ride.route';
import { UserRoutes } from '../modules/user/user.route';

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/ride',
        route: RideRoutes,
    },
    {
        path: '/driver',
        route: DriverRoutes,
    },
    {
        path: '/contact',
        route: ContactRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
