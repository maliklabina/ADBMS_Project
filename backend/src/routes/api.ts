import express from 'express';
import { createUser, getUserById, getUsers, updateUser, deleteUser } from '../controllers/userController';
import { loginAdmin, createInitialAdmin } from '../controllers/adminController';
import { loginUser, registerUser } from '../controllers/authController';
import { 
    createBooking, 
    getAllBookings, 
    getBookingById, 
    updateBookingStatus,
    cancelBooking,
    checkAvailability 
} from '../controllers/bookingController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Admin routes
router.post('/admin/login', loginAdmin);
router.post('/admin/setup', createInitialAdmin);

// User auth routes
router.post('/users/login', loginUser);
router.post('/users/register', registerUser);

// Protected user routes
router.post('/users', auth, createUser);
router.get('/users', auth, getUsers);
router.get('/users/:id', auth, getUserById);
router.put('/users/:id', auth, updateUser);
router.delete('/users/:id', auth, deleteUser);

// Booking routes
router.post('/bookings', createBooking);
router.get('/bookings', auth, getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id/status', auth, updateBookingStatus);
router.post('/bookings/:id/cancel', cancelBooking);
router.get('/bookings/check-availability', checkAvailability);

export default router;