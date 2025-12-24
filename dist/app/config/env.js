"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const requiredEnvVariables = [
        'PORT',
        'MONGODB_URL',
        'NODE_ENV',
        'JWT_ACCESS_TOKEN_SECRET',
        'JWT_ACCESS_EXPIRATION_TIME',
        'JWT_REFRESH_TOKEN_SECRET',
        'JWT_REFRESH_EXPIRATION_TIME',
        'BCRYPT_SALT_ROUNDS',
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'EXPRESS_SESSION_SECRET',
        'FRONTEND_URL',
        'SSL_STORE_ID',
        'SSL_STORE_PASSWORD',
        'SSL_PAYMENT_API',
        'SSL_VALIDATION_API',
        'SSL_SUCCESS_BACKEND_URL',
        'SSL_FAIL_BACKEND_URL',
        'SSL_CANCEL_BACKEND_URL',
        'SSL_SUCCESS_FRONTEND_URL',
        'SSL_FAIL_FRONTEND_URL',
        'SSL_CANCEL_FRONTEND_URL',
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        MONGODB_URL: process.env.MONGODB_URL,
        NODE_ENV: process.env.NODE_ENV,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
        JWT_ACCESS_EXPIRATION_TIME: process.env
            .JWT_ACCESS_EXPIRATION_TIME,
        JWT_REFRESH_TOKEN_SECRET: process.env
            .JWT_REFRESH_TOKEN_SECRET,
        JWT_REFRESH_EXPIRATION_TIME: process.env
            .JWT_REFRESH_EXPIRATION_TIME,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        SSL_STORE_ID: process.env.SSL_STORE_ID,
        SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD,
        SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
        SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
        SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
        SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
        SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
        SSL_SUCCESS_FRONTEND_URL: process.env
            .SSL_SUCCESS_FRONTEND_URL,
        SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
        SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
    };
};
exports.envVars = loadEnvVariables();
