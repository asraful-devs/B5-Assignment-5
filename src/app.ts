import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import { envVars } from './app/config/env';
import './app/config/passport';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import { router } from './app/routes';

const app = express();

app.use(
    expressSession({
        secret: envVars.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: envVars.FRONTEND_URL,
        credentials: true,
    })
);

app.set('trust proxy', 1); // Enable if behind a reverse proxy

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Ride Booking API');
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
