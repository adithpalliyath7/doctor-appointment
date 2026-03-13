const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'medi.connect.health@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        console.log(`Register attempt for: ${req.body.email}. DB readyState: ${mongoose.connection.readyState}`);
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connection not available. Please ensure MongoDB is running.' });
        }
        const { name, email, phone, password, role, doctorInfo } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({
            name,
            email,
            phone,
            password,
            otp,
            otpExpires,
            isVerified: false,
            role: role || 'patient'
        });

        if (user) {
            // Send Email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'MediConnect - Email Verification OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                        <h2 style="color: #49B3A3; text-align: center;">Welcome to MediConnect!</h2>
                        <p>Hello ${name},</p>
                        <p>Thank you for joining our platform. Please use the OTP below to verify your email address:</p>
                        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 15px; margin: 20px 0;">
                            <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 40px;">If you didn't request this, please ignore this email.</p>
                    </div>
                `
            };

            try {
                console.log(`[TESTING] OTP for ${user.email} is: ${otp}`);
                await transporter.sendMail(mailOptions);
                console.log(`Email sent successfully to ${user.email}`);
            } catch (mailError) {
                console.error('Primary mail sending failed:', mailError.message);
                console.log('Attempting to send via Ethereal Email fallback...');
                try {
                    // Create a test account on the fly for Ethereal fallback
                    const testAccount = await nodemailer.createTestAccount();
                    const etherealTransporter = nodemailer.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: testAccount.user, // generated ethereal user
                            pass: testAccount.pass, // generated ethereal password
                        },
                    });

                    const info = await etherealTransporter.sendMail({
                        ...mailOptions,
                        from: '"MediConnect Support" <support@mediconnect.com>'
                    });
                    console.log("Fallback email sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                    console.log("-----------------------------------------------------");
                    console.log(`!!! USE THIS LINK TO VIEW THE OTP FOR ${user.email} !!!`);
                    console.log("-----------------------------------------------------");
                } catch (fallbackError) {
                    console.error('Fallback Ethereal sending also failed:', fallbackError);
                }
            }

            // If user is a doctor, create doctor profile
            if (role === 'doctor' && doctorInfo) {
                await Doctor.create({
                    user: user._id,
                    specialization: doctorInfo.specialization || 'General Physician',
                    hospital: doctorInfo.hospital || 'Default Hospital',
                    fee: doctorInfo.fee || 500
                });
            }

            res.status(201).json({
                message: 'Registration successful. OTP sent to email.',
                userId: user._id,
                email: user.email,
                ...(process.env.NODE_ENV === 'development' && { debugOTP: otp })
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'MediConnect - New Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                    <h2 style="color: #49B3A3; text-align: center;">New Verification Code</h2>
                    <p>Hello ${user.name},</p>
                    <p>Your new OTP for MediConnect verification is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 15px; margin: 20px 0;">
                        <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Resend Email sent successfully to ${user.email}`);
        } catch (mailError) {
            console.error('Primary mail resending failed:', mailError.message);
            console.log('Attempting to send via Ethereal Email fallback...');
            try {
                const testAccount = await nodemailer.createTestAccount();
                const etherealTransporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });

                const info = await etherealTransporter.sendMail({
                    ...mailOptions,
                    from: '"MediConnect Support" <support@mediconnect.com>'
                });
                console.log("Fallback email sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                console.log("-----------------------------------------------------");
                console.log(`!!! USE THIS LINK TO VIEW THE RESENT OTP FOR ${user.email} !!!`);
                console.log("-----------------------------------------------------");
            } catch (fallbackError) {
                console.error('Fallback Ethereal sending also failed:', fallbackError);
            }
        }
        res.json({
            message: 'OTP resent successfully (check console for Ethereal link if Gmail failed)',
            ...(process.env.NODE_ENV === 'development' && { debugOTP: otp })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'MediConnect - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                    <h2 style="color: #49B3A3; text-align: center;">Reset Your Password</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 15px; margin: 20px 0;">
                        <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p style="color: #888; font-size: 12px; text-align: center; margin-top: 40px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        try {
            console.log(`[TESTING] Password Reset OTP for ${user.email} is: ${otp}`);
            await transporter.sendMail(mailOptions);
            console.log(`Password reset email sent successfully to ${user.email}`);
        } catch (mailError) {
            console.error('Primary mail sending failed:', mailError.message);
            console.log('Attempting to send via Ethereal Email fallback...');
            try {
                const testAccount = await nodemailer.createTestAccount();
                const etherealTransporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });

                const info = await etherealTransporter.sendMail({
                    ...mailOptions,
                    from: '"MediConnect Support" <support@mediconnect.com>'
                });
                console.log("Fallback email sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                console.log("-----------------------------------------------------");
                console.log(`!!! USE THIS LINK TO VIEW THE RESET OTP FOR ${user.email} !!!`);
                console.log("-----------------------------------------------------");
            } catch (fallbackError) {
                console.error('Fallback Ethereal sending also failed:', fallbackError);
            }
        }

        res.json({
            message: 'Password reset OTP sent to email (check console for Ethereal link if Gmail failed)',
            ...(process.env.NODE_ENV === 'development' && { debugOTP: otp })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resetPasswordOTP === otp && user.resetPasswordExpires > Date.now()) {
            // Salt and hash the new password manually since pre-save might not trigger on simple save if we don't handle it right
            // Actually, user.password = newPassword; await user.save() WILL trigger pre-save because we used .save()
            user.password = newPassword;
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        console.log(`Login attempt for: ${req.body.email}. DB readyState: ${mongoose.connection.readyState}`);
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database connection not available. Please ensure MongoDB is running.' });
        }
        const { email, password, hospitalCode, systemCode } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Secondary verification for Admin
            if (user.role === 'admin' && !systemCode) {
                return res.status(400).json({ message: 'System authorization required' });
            }

            // In a real app, you would verify hospitalCode/systemCode here
            // For now, we allow any code if it was provided

            let doctorData = {};
            if (user.role === 'doctor') {
                const Doctor = require('../models/Doctor');
                const doctor = await Doctor.findOne({ user: user._id });
                if (doctor) {
                    doctorData = {
                        specialization: doctor.specialization,
                        hospital: doctor.hospital,
                        experience: doctor.experience,
                        education: doctor.education,
                        bio: doctor.bio
                    };
                }
            }

            res.json({
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                location: user.location,
                bloodGroup: user.bloodGroup,
                dob: user.dob,
                ...doctorData,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let doctorData = {};
        if (user.role === 'doctor') {
            const Doctor = require('../models/Doctor');
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) {
                doctorData = {
                    specialization: doctor.specialization,
                    hospital: doctor.hospital,
                    experience: doctor.experience,
                    education: doctor.education,
                    bio: doctor.bio
                };
            }
        }

        res.json({
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            location: user.location,
            bloodGroup: user.bloodGroup,
            dob: user.dob,
            ...doctorData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.location = req.body.location || user.location;
            user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
            user.dob = req.body.dob || user.dob;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // If user is a doctor, update linked Doctor document
            let doctorData = {};
            if (updatedUser.role === 'doctor') {
                const Doctor = require('../models/Doctor');
                let doctor = await Doctor.findOne({ user: updatedUser._id });
                if (doctor) {
                    doctor.specialization = req.body.specialization || doctor.specialization;
                    doctor.hospital = req.body.hospital || doctor.hospital;
                    doctor.experience = req.body.experience || doctor.experience;
                    doctor.education = req.body.education || doctor.education;
                    doctor.bio = req.body.bio || doctor.bio;
                    await doctor.save();

                    doctorData = {
                        specialization: doctor.specialization,
                        hospital: doctor.hospital,
                        experience: doctor.experience,
                        education: doctor.education,
                        bio: doctor.bio
                    };
                }
            }

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location: updatedUser.location,
                bloodGroup: updatedUser.bloodGroup,
                dob: updatedUser.dob,
                role: updatedUser.role,
                ...doctorData,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
