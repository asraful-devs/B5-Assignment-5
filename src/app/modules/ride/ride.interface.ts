import { Types } from 'mongoose';

export enum RideStatus {
    PENDING = 'PENDING',
    PICKED = 'PICKED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface IRide {
    _id?: string;
    user: Types.ObjectId;
    driver?: Types.ObjectId;
    pickupLocation: string;
    dropLocation: string;
    payment: number;
    status: RideStatus;
    paymentUrl?: string;
    createdAt?: Date;
}
