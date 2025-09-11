import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequst from '../../middlewares/validateRequst';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';

const router = Router();

/* ----- Fixed Order ----- */
// Static routes should come before dynamic ones

// Current user info
router.get('/me', checkAuth(...Object.values(Role)), UserControllers.getMe);

// Register
router.post(
    '/register',
    validateRequst(createUserZodSchema),
    UserControllers.createUser
);

// Get all users (admin only)
router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUsers);

// Get all drivers (admin only)
router.get(
    '/all-drivers',
    checkAuth(Role.ADMIN),
    UserControllers.getAllDrivers
);

// Get all riders (admin only)
router.get('/all-riders', checkAuth(Role.ADMIN), UserControllers.getAllRiders);

// Update user (by id)
router.patch(
    '/:id',
    validateRequst(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    UserControllers.updateUser
);

// Delete user (by id - admin only)
router.delete('/:id', checkAuth(Role.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
