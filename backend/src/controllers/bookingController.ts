import { Request, Response } from 'express';
import Booking from '../models/booking';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.status(200).json(booking);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel booking
export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.status(200).json(booking);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Check room availability
export const checkAvailability = async (req: Request, res: Response) => {
    try {
        const { checkIn, checkOut, roomType } = req.query;
        
        const overlappingBookings = await Booking.find({
            roomType: roomType as string,
            status: { $nin: ['cancelled'] },
            $or: [
                {
                    checkIn: { 
                        $lte: new Date(checkOut as string) 
                    },
                    checkOut: { 
                        $gte: new Date(checkIn as string) 
                    }
                }
            ]
        });

        const isAvailable = overlappingBookings.length === 0;
        
        res.status(200).json({ 
            available: isAvailable,
            existingBookings: overlappingBookings.length
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
