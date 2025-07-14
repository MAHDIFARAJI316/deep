import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import { config } from '../config';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string(),
});

// Register new user
router.post('/register', asyncHandler(async (req, res) => {
    // Validate request body
    const { username, email, password } = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        return res.status(409).json({
            error: 'User already exists with this email or username'
        });
    }

    // Create new user
    const user = new User({
        username,
        email,
        password,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}));

// Login user
router.post('/login', asyncHandler(async (req, res) => {
    // Validate request body
    const { email, password } = loginSchema.parse(req.body);

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            lastLogin: user.lastLogin,
        }
    });
}));

// Get current user profile
router.get('/me', asyncHandler(async (req, res) => {
    // Note: This assumes you have middleware that adds user to req
    // You'll need to implement auth middleware separately
    const user = await User.findById(req.user?.id);
    
    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    res.json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
        }
    });
}));

export default router; 