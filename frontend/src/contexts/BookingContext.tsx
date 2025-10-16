import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface Booking {
  _id: string;
  guestName: string;
  roomType: 'Single' | 'Double' | 'Deluxe' | 'Suite';
  checkInDate: string;
  checkOutDate: string;
  contactNumber: string;
  email: string;
  idProof?: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, '_id' | 'createdAt' | 'status'>) => Promise<void>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getBooking: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      console.log('BookingContext: Fetching bookings...');
      setLoading(true);
      setError(null);
      const data = await api.getAllBookings();
      console.log('BookingContext: Fetched bookings', data);
      setBookings(data);
    } catch (err: any) {
      console.error('BookingContext: Error fetching bookings', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const addBooking = async (bookingData: Omit<Booking, '_id' | 'createdAt' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      const newBooking = await api.createBooking({
        ...bookingData,
        checkIn: new Date(bookingData.checkInDate),
        checkOut: new Date(bookingData.checkOutDate),
        phoneNumber: bookingData.contactNumber,
        numberOfGuests: 1,
        totalAmount: 0, // This should be calculated based on your business logic
      });
      setBookings(prev => [...prev, newBooking]);
    } catch (err: any) {
      setError(err.message || 'Failed to add booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      setLoading(true);
      setError(null);
      const updatedBooking = await api.updateBookingStatus(id, status);
      setBookings(prev =>
        prev.map(booking =>
          booking._id === id ? updatedBooking : booking
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: string, updatedData: Partial<Booking>) => {
    if ('status' in updatedData) {
      return updateBookingStatus(id, updatedData.status as Booking['status']);
    }
    throw new Error('Only status updates are supported at this time');
  };

  const cancelBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const cancelledBooking = await api.cancelBooking(id);
      setBookings(prev =>
        prev.map(booking =>
          booking._id === id ? cancelledBooking : booking
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBooking = (id: string) => {
    return bookings.find(booking => booking._id === id);
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        loading, 
        error, 
        fetchBookings, 
        addBooking, 
        updateBooking, 
        updateBookingStatus, 
        cancelBooking, 
        getBooking 
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
