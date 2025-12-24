import { model, Schema } from 'mongoose';
import { IPayment, PaymentStatus } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
    {
        ride: {
            type: Schema.Types.ObjectId,
            ref: 'Ride',
            required: true,
            unique: true,
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.UNPAID,
        },

        amount: { type: Number, required: true },

        paymentGateway: { type: Schema.Types.Mixed },

        invoiceUrl: { type: String },
    },
    { timestamps: true }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
