import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    guestName: string;
    email: string;
    phoneNumber: string;
    checkIn: Date;
    checkOut: Date;
    roomType: string;
    numberOfGuests: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    specialRequests?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema({
    guestName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    roomType: {
        type: String,
        required: true,
        enum: ['standard', 'deluxe', 'suite', 'presidential']
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Add validation for check-in and check-out dates
bookingSchema.pre('save', function(next) {
    const booking = this as IBooking;
    if (booking.checkIn >= booking.checkOut) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;
