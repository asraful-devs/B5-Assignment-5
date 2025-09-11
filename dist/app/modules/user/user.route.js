"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequst_1 = __importDefault(require("../../middlewares/validateRequst"));
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
/* ----- Fixed Order ----- */
// Static routes should come before dynamic ones
// Current user info
router.get('/me', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// Register
router.post('/register', (0, validateRequst_1.default)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
// Get all users (admin only)
router.get('/all-users', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.getAllUsers);
// Get all drivers (admin only)
router.get('/all-drivers', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.getAllDrivers);
// Get all riders (admin only)
router.get('/all-riders', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.getAllRiders);
// Update user (by id)
router.patch('/:id', (0, validateRequst_1.default)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.updateUser);
// Delete user (by id - admin only)
router.delete('/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
