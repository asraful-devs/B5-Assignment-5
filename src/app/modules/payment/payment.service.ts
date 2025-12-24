import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { RideStatus } from '../ride/ride.interface';
import { Ride } from '../ride/ride.model';
import { ISSLCommerz } from '../SSLCommerz/SSLCommerz.interface';
import { SSLService } from '../SSLCommerz/SSLCommerz.service';
import { User } from '../user/user.model';
import { PaymentStatus } from './payment.interface';
import { Payment } from './payment.model';

// const initPayment = async (rideId: string) => {
//     const ride = await Ride.findById(rideId);

//     if (!ride) {
//         throw new AppError(
//             httpStatus.NOT_FOUND,
//             'Ride not found. Unable to process payment.'
//         );
//     }

//     if (ride.status !== RideStatus.PICKED) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             `Payment can only be initiated when ride status is PICKED. Current status: ${ride.status}`
//         );
//     }

//     const payment = await Payment.findOne({ ride: rideId });

//     if (!payment) {
//         throw new AppError(
//             httpStatus.NOT_FOUND,
//             'Payment record not found for this ride.'
//         );
//     }

//     if (payment.status === PaymentStatus.PAID) {
//         throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'Payment for this ride has already been completed.'
//         );
//     }

//     const userData = await User.findById(ride.user);

//     if (!userData) {
//         throw new AppError(httpStatus.NOT_FOUND, 'User information not found.');
//     }

//     const sslPayload: ISSLCommerz = {
//         address: userData.address || 'N/A',
//         email: userData.email,
//         phoneNumber: userData.phone || 'N/A',
//         name: userData.name,
//         amount: payment.amount,
//         transactionId: payment.transactionId,
//     };

//     const sslPayment = await SSLService.sslPaymentInit(sslPayload);

//     return {
//         paymentUrl: sslPayment.GatewayPageURL,
//     };
// };

const initPayment = async (rideId: string) => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Ride not found. Unable to process payment.'
        );
    }

    if (ride.status !== RideStatus.PICKED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Payment can only be initiated when ride status is PICKED. Current status: ${ride.status}`
        );
    }

    const payment = await Payment.findOne({ ride: rideId });

    if (!payment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Payment record not found for this ride.'
        );
    }

    if (payment.status === PaymentStatus.PAID) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment for this ride has already been completed.'
        );
    }

    // ✅ যদি paymentUrl ইতিমধ্যে save থাকে, সেটা return করুন
    if (payment.paymentUrl) {
        console.log('✅ Using existing paymentUrl:', payment.paymentUrl);
        return {
            paymentUrl: payment.paymentUrl,
        };
    }

    // ✅ নাহলে নতুন করে generate করুন এবং save করুন
    const userData = await User.findById(ride.user);

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User information not found.');
    }

    const sslPayload: ISSLCommerz = {
        address: userData.address || 'N/A',
        email: userData.email,
        phoneNumber: userData.phone || 'N/A',
        name: userData.name,
        amount: payment.amount,
        transactionId: payment.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);
    const paymentUrl = sslPayment.GatewayPageURL;

    // ✅ Database এ save করুন যাতে পরবর্তীতে reuse করতে পারেন
    const updatedPayment = await Payment.findByIdAndUpdate(
        payment._id,
        { paymentUrl },
        { new: true }
    );

    return {
        paymentUrl: updatedPayment.paymentUrl,
    };
};

const successPayment = async (query: Record<string, string>) => {
    const session = await Ride.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PaymentStatus.PAID,
            },
            { new: true, runValidators: true, session: session }
        );

        if (!updatedPayment) {
            throw new AppError(401, 'Payment record not found.');
        }

        // ✅ গুরুত্বপূর্ণ: এখানে Ride Status COMPLETED করছি না
        // ✅ কারণ: Payment complete হওয়ার পরে Driver নিজেই Ride complete করবে
        // ✅ Driver এর side থেকে একটি separate function থাকবে যা
        //    Payment Status check করবে এবং তারপর Ride complete করবে
        // ✅ যদি Payment complete না হয় তাহলে Driver complete করতে পারবে না

        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            message:
                'Payment Completed Successfully. Driver will now complete the ride.',
            payment: updatedPayment,
            // ✅ Ride এর status এখনও PICKED থাকবে - Driver এর জন্য অপেক্ষায়
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const failPayment = async (query: Record<string, string>) => {
    const session = await Ride.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PaymentStatus.FAILED,
            },
            { new: true, runValidators: true, session: session }
        );

        if (!updatedPayment) {
            throw new AppError(401, 'Payment record not found.');
        }

        await Ride.findByIdAndUpdate(
            updatedPayment.ride,
            { status: RideStatus.PENDING },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: false,
            message: 'Payment Failed. Please try again.',
            payment: updatedPayment,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cancelPayment = async (query: Record<string, string>) => {
    const session = await Ride.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            {
                status: PaymentStatus.CANCELLED,
            },
            { runValidators: true, session: session }
        );

        if (!updatedPayment) {
            throw new AppError(401, 'Payment record not found.');
        }

        await Ride.findByIdAndUpdate(
            updatedPayment.ride,
            { status: RideStatus.PENDING },
            { runValidators: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return {
            success: false,
            message: 'Payment Cancelled',
            payment: updatedPayment,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};
