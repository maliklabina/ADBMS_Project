import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IAdminModel extends Model<IAdmin> {
    findByCredentials(username: string, password: string): Promise<IAdmin>;
}

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
adminSchema.pre<IAdmin>('save', async function(next) {
    const admin = this;
    
    if (!admin.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    const admin = this as IAdmin;
    try {
        return await bcrypt.compare(candidatePassword, admin.password);
    } catch (error) {
        throw error;
    }
};

const Admin = mongoose.model<IAdmin, IAdminModel>('Admin', adminSchema);
export default Admin;
