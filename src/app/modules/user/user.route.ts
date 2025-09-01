import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequst from '../../middlewares/validateRequst';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';

const router = Router();

router.post(
    '/register',
    validateRequst(createUserZodSchema),
    UserControllers.createUser
);

router.patch(
    '/:id',
    validateRequst(updateUserZodSchema),
    checkAuth(...Object.values(Role)),
    UserControllers.updateUser
);

router.delete('/:id', checkAuth(Role.ADMIN), UserControllers.deleteUser);

router.get('/me', checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.get(
    '/all-drivers',
    checkAuth(Role.ADMIN),
    UserControllers.getAllDrivers
);

router.get('/all-riders', checkAuth(Role.ADMIN), UserControllers.getAllRiders);

export const UserRoutes = router;
