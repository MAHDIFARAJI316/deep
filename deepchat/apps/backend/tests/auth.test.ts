import supertest from 'supertest';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
const app = require('@backend/server').default;
import mongoose from 'mongoose';
import User from '@backend/models/User';

const request = supertest(app);

describe('Auth Module', () => {
    const validPhone = '09123456789';
    const invalidPhone = '123';
    const mockOtp = '123456';

    beforeAll(async () => {
        // Use an in-memory MongoDB server for tests if available, or connect to a test DB
        // For simplicity, we'll use the actual DB and clean up
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/deepchat-test');
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/auth/request-otp', () => {
        it('should send an OTP to a new valid phone number', async () => {
            const res = await request.post('/api/auth/request-otp').send({ phone: validPhone });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('OTP sent successfully.');
            const user = await User.findOne({ phone: validPhone });
            expect(user).not.toBeNull();
            expect(user?.otp).toBeDefined();
            expect(user?.otp).toMatch(/^[0-9]{6}$/);
        });

        it('should return a validation error for an invalid phone number', async () => {
            const res = await request.post('/api/auth/request-otp').send({ phone: invalidPhone });
            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/verify-otp', () => {
        beforeEach(async () => {
            // Create a user with an OTP to verify
            const user = new User({
                phone: validPhone,
                otp: mockOtp,
                otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
            });
            await user.save();
        });

        it('should verify a valid OTP and return a token', async () => {
            const res = await request.post('/api/auth/verify-otp').send({ phone: validPhone, otp: mockOtp });
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Login successful.');
            expect(res.body.user.phone).toBe(validPhone);
            expect(res.headers['set-cookie']).toBeDefined();
            const user = await User.findOne({ phone: validPhone });
            expect(user?.isVerified).toBe(true);
            expect(user?.otp).toBeNull();
        });

        it('should reject an invalid OTP', async () => {
            const res = await request.post('/api/auth/verify-otp').send({ phone: validPhone, otp: '654321' });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid OTP or OTP has expired.');
        });
    });
}); 