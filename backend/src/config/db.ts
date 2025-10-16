import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any);
        console.log('MongoDB connected successfully');
    } catch (error: any) {
        console.error('MongoDB connection error:', {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        process.exit(1);
    }
};

export default connectDB;