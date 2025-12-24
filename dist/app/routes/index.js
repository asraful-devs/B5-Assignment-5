"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const contact_routes_1 = require("../modules/contact/contact.routes");
const driver_route_1 = require("../modules/driver/driver.route");
const payment_route_1 = require("../modules/payment/payment.route");
const ride_route_1 = require("../modules/ride/ride.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/ride',
        route: ride_route_1.RideRoutes,
    },
    {
        path: '/driver',
        route: driver_route_1.DriverRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/contact',
        route: contact_routes_1.ContactRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
