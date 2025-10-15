import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin';

// Admin Login
export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Create Initial Admin (use this only once)
export const createInitialAdmin = async (req: Request, res: Response) => {
    try {
        const adminExists = await Admin.findOne({});
        if (adminExists) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const admin = new Admin({
            username: 'admin',
            password: 'admin123' // This will be hashed automatically
        });

        await admin.save();
        res.status(201).json({ message: 'Initial admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
