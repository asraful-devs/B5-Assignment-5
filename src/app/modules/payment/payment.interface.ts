import { Types } from 'mongoose';

export enum PaymentStatus {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface IPayment {
    ride: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGateway?: string;
    invoiceUrl?: string;
    status: PaymentStatus;
}
