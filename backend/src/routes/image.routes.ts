import { Router, Request, Response } from 'express';
import imageService from '../services/image.service';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/image/generate
 * @desc    Generate an image from text prompt
 * @access  Private
 */
router.post('/generate', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { prompt, style, provider } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, error: 'Prompt is required' });
        }

        console.log(`[Image] Generating: "${prompt.substring(0, 50)}..."`);

        const result = await imageService.generate(prompt, { style, provider });

        res.json({
            success: true,
            data: {
                image: result.image,
                provider: result.provider
            }
        });
    } catch (error: any) {
        console.error('[Image] Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/image/styles
 * @desc    Get available image styles
 * @access  Public
 */
router.get('/styles', (req: Request, res: Response) => {
    const styles = [
        { id: 'digital-art', name: 'Digital Art' },
        { id: 'photographic', name: 'Photographic' },
        { id: '3d-model', name: '3D Model' },
        { id: 'anime', name: 'Anime' },
        { id: 'cinematic', name: 'Cinematic' },
        { id: 'fantasy-art', name: 'Fantasy Art' },
        { id: 'neon-punk', name: 'Neon Punk' },
        { id: 'origami', name: 'Origami' },
        { id: 'pixel-art', name: 'Pixel Art' },
        { id: 'line-art', name: 'Line Art' },
    ];
    res.json({ success: true, data: styles });
});

export default router;
