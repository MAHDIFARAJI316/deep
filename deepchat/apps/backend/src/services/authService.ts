import User from '@backend/models/User';
import { generateToken } from '@backend/utils/token';
import { randomInt } from 'crypto';

const generateOtp = () => randomInt(100000, 999999).toString();

export const requestOtp = async (phone: string) => {
    let user = await User.findOne({ phone });

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
        // User exists, update OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.isVerified = false; // Require re-verification
    } else {
        // New user, create one
        user = new User({
            phone,
            otp,
            otpExpires,
        });
    }

    await user.save();
    console.log(`Mock OTP for ${phone}: ${otp}`); // In production, send via SMS
    return { message: 'OTP sent successfully.' };
};

export const verifyOtp = async (phone: string, otp: string) => {
    const user = await User.findOne({
        phone,
        otp,
        otpExpires: { $gt: new Date() },
    });

    if (!user) {
        throw new Error('Invalid OTP or OTP has expired.');
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user);
    return { token, user: { id: user._id, phone: user.phone, role: user.role } };
}; 