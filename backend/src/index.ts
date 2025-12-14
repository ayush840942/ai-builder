// Load environment variables FIRST - before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Import routes AFTER dotenv is loaded
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';
import imageRoutes from './routes/image.routes';
import voiceRoutes from './routes/voice.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true
    }
});

const PORT = process.env.PORT || 3001;

// Log API keys (redacted)
logger.info(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Set (' + process.env.OPENAI_API_KEY.substring(0, 10) + '...)' : '❌ Not set'}`);
logger.info(`Groq API Key: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ Not set'}`);
logger.info(`Image APIs: Stability ${process.env.STABILITY_API_KEY ? '✅' : '❌'} | HuggingFace ${process.env.HUGGINGFACE_API_KEY ? '✅' : '❌'}`);
logger.info(`Voice APIs: ElevenLabs ${process.env.ELEVENLABS_API_KEY ? '✅' : '❌'} | Deepgram ${process.env.DEEPGRAM_API_KEY ? '✅' : '❌'}`);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.raw({ type: 'audio/*', limit: '50mb' }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            ai: !!process.env.OPENAI_API_KEY || !!process.env.GROQ_API_KEY,
            image: !!process.env.STABILITY_API_KEY || !!process.env.HUGGINGFACE_API_KEY,
            voice: !!process.env.ELEVENLABS_API_KEY || !!process.env.DEEPGRAM_API_KEY
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/voice', voiceRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('join-project', (projectId: string) => {
        socket.join(`project:${projectId}`);
        logger.info(`Socket ${socket.id} joined project ${projectId}`);
    });

    socket.on('code-update', (data: { projectId: string; code: string }) => {
        socket.to(`project:${data.projectId}`).emit('code-updated', data.code);
    });

    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server if not running in Vercel
if (process.env.NODE_ENV !== 'production') {
    httpServer.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
}

export default app;
export { httpServer, io };

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});


