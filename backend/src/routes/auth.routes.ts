import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { supabase } from '../config/supabase';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(1).max(100)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

// Helper to safely get name
function user_metadata(user: any) {
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
}

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/register',
    validateRequest(registerSchema),
    async (req: Request, res: Response) => {
        try {
            const { email, password, name } = req.body;

            // Register with Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });

            if (error) {
                // If user already exists (auth/user-already-exists), Supabase returns error or data depending on config
                // We should handle it nicely
                if (error.message.includes('already registered')) {
                    return res.status(400).json({
                        success: false,
                        error: 'User already exists'
                    });
                }
                throw error;
            }

            if (!data.user) {
                // If email confirmation is enabled, user might be null or session null?
                // Usually user is not null but session might be null.
                if (data.user === null && !error) {
                    return res.status(200).json({
                        success: true,
                        message: 'Registration successful. Please check your email to verify your account.'
                    });
                }
                throw new Error('Registration failed - no user returned');
            }

            // Create JWT token for our backend API
            const token = jwt.sign(
                { userId: data.user.id, email: data.user.email },
                (process.env.JWT_SECRET || 'demo-secret-key-change-in-production') as jwt.Secret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
            );

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        name: user_metadata(data.user)
                    },
                    token
                }
            });
        } catch (error: any) {
            console.error('Registration Error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Registration failed'
            });
        }
    }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    validateRequest(loginSchema),
    async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Login with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            if (!data.user) {
                throw new Error('Login failed');
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: data.user.id, email: data.user.email },
                (process.env.JWT_SECRET || 'demo-secret-key-change-in-production') as jwt.Secret,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
            );

            res.json({
                success: true,
                data: {
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        name: user_metadata(data.user)
                    },
                    token
                }
            });
        } catch (error: any) {
            console.error('Login Error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Login failed'
            });
        }
    }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', async (req: Request, res: Response) => {
    // Optionally call supabase.auth.signOut() here if we were using cookie session
    // But we are using JWT, so client just drops the token.
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

export default router;
