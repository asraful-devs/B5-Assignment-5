# RideShareX Backend API

A professional role-based ride-sharing backend API built with Express.js, TypeScript, and MongoDB. Supports riders, drivers, and admins with JWT authentication and SSL Commerz payment integration.

## Tech Stack

-   **Runtime:** Node.js
-   **Language:** TypeScript
-   **Framework:** Express.js
-   **Database:** MongoDB + Mongoose
-   **Authentication:** JWT + Passport.js (Local & Google OAuth)
-   **Payment:** SSL Commerz API
-   **Security:** bcryptjs, CORS
-   **Validation:** Zod

## Project Features

-   JWT-based authentication with role support (rider, driver, admin)
-   Google OAuth 2.0 integration
-   Secure password storage using bcrypt
-   Role-based access control (RBAC)
-   Complete ride lifecycle: PENDING → ACCEPTED → PICKED → COMPLETED
-   SSL Commerz payment gateway integration
-   Contact form submission system
-   User verification and blocking features
-   Driver approval workflow
-   Ride history and statistics

## Folder Structure

```
src/
├── app.ts                              # Express app setup
├── server.ts                           # Server entry point
├── app/
│   ├── config/
│   │   ├── env.ts                      # Environment variables
│   │   └── passport.ts                 # Passport strategies
│   ├── modules/
│   │   ├── auth/                       # Authentication (login, register, JWT)
│   │   ├── user/                       # User management
│   │   ├── ride/                       # Ride operations
│   │   ├── driver/                     # Driver operations
│   │   ├── payment/                    # Payment handling
│   │   ├── SSLCommerz/                 # Payment gateway service
│   │   ├── contact/                    # Contact form
│   │   └── routes/                     # All API routes
│   ├── middlewares/
│   │   ├── checkAuth.ts                # Authentication middleware
│   │   ├── validateRequst.ts           # Request validation
│   │   ├── globalErrorHandler.ts       # Error handling
│   │   └── notFound.ts                 # 404 handler
│   ├── utils/
│   │   ├── catchAsync.ts               # Async error wrapper
│   │   ├── jwt.ts                      # JWT utilities
│   │   ├── sendResponse.ts             # Response formatter
│   │   ├── setCookies.ts               # Cookie utilities
│   │   └── userTokens.ts               # Token generation
│   ├── helpers/
│   │   ├── handleCastError.ts          # MongoDB errors
│   │   ├── handleValidationError.ts    # Validation errors
│   │   └── handleZodError.ts           # Zod validation errors
│   └── error/
│       └── AppError.ts                 # Custom error class
├── package.json
├── tsconfig.json
└── vercel.json
```

## API Endpoints

**Base URL:** https://ridesharex-server-site.onrender.com/api/v1

### Authentication

-   `POST /auth/register` - User registration
-   `POST /auth/login` - User login
-   `GET /auth/google` - Google OAuth
-   `POST /auth/logout` - User logout
-   `POST /auth/refresh-token` - Refresh access token
-   `POST /auth/reset-password` - Reset password

### User Management

-   `GET /user/all-users` - Get all users (admin)
-   `GET /user/all-drivers` - Get all drivers
-   `GET /user/all-riders` - Get all riders
-   `PUT /user/:id` - Update user profile
-   `DELETE /user/:id` - Delete user

### Ride Management

-   `POST /ride/create` - Create new ride
-   `GET /ride/my-rides` - Get user's rides
-   `GET /ride/stats` - Get ride statistics
-   `PUT /ride/:id` - Update ride
-   `DELETE /ride/:id` - Cancel ride

### Driver Operations

-   `GET /driver/available-rides` - Get available rides
-   `POST /driver/pick-up-ride/:id` - Accept ride
-   `GET /driver/my-rides` - Get driver's rides
-   `PUT /driver/update-ride-status/:id` - Update ride status

### Payment Processing

-   `POST /payment/init-payment/:rideId` - Initialize payment
-   `GET /payment/ssl-payment-success` - Payment success callback
-   `GET /payment/ssl-payment-fail` - Payment failure callback
-   `GET /payment/ssl-payment-cancel` - Payment cancellation callback

### Contact Form

-   `POST /contact/create` - Submit contact form

## Payment System (SSL Commerz)

The payment flow works as follows:

1. **Ride Created** - Payment record created with UNPAID status
2. **Payment Initialized** - User requests payment, gets SSL Commerz gateway URL
3. **User Redirected** - User completes payment on SSL Commerz
4. **SSL Commerz Callback** - Payment gateway sends success/fail response
5. **Status Updated** - Payment marked as PAID or FAILED
6. **Ride Updated** - Ride status updates accordingly

**Payment Statuses:** UNPAID → PENDING → PAID or FAILED

## Database Models

### User

-   name, email, password (hashed)
-   role: rider | driver | admin
-   phone, picture, isVerified, isActive
-   OAuth providers (Google)

### Ride

-   user (rider reference)
-   driver (driver reference)
-   pickupLocation, dropLocation
-   payment amount
-   status: PENDING | ACCEPTED | PICKED | COMPLETED | CANCELLED

### Payment

-   ride reference (unique)
-   transactionId (unique)
-   status: PAID | UNPAID | PENDING | FAILED
-   amount, payment gateway data

## Important Links

**Live API:** https://ridesharex-server-site.onrender.com/api/v1/

**YouTube Tutorial:** https://youtu.be/bEKpn8Z6B-I?si=E39WFuc01hfon3cw
