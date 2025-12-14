import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }

    try {
        // Special handling for demo token
        if (token === 'demo-token') {
            (req as AuthRequest).user = {
                // Use a fixed UUID for demo user so Supabase accepts it
                userId: '00000000-0000-0000-0000-000000000000',
                email: 'demo@aibuilder.dev'
            };
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key-change-in-production') as {
            userId: string;
            email: string;
        };

        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
