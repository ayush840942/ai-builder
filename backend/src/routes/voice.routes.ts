import { Router, Request, Response } from 'express';
import voiceService from '../services/voice.service';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/voice/tts
 * @desc    Text to Speech
 * @access  Private
 */
router.post('/tts', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { text, voiceId } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, error: 'Text is required' });
        }

        console.log(`[Voice] TTS: "${text.substring(0, 50)}..."`);

        const audioBuffer = await voiceService.textToSpeech(text, voiceId);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
    } catch (error: any) {
        console.error('[Voice] TTS Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/voice/stt
 * @desc    Speech to Text
 * @access  Private
 */
router.post('/stt', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.body || req.body.length === 0) {
            return res.status(400).json({ success: false, error: 'Audio data required' });
        }

        console.log('[Voice] STT: Processing audio...');

        const audioBuffer = Buffer.from(req.body);
        const contentType = req.headers['content-type'] || 'audio/wav';

        const transcript = await voiceService.speechToText(audioBuffer, contentType);

        res.json({
            success: true,
            data: { transcript }
        });
    } catch (error: any) {
        console.error('[Voice] STT Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/voice/voices
 * @desc    Get available TTS voices
 * @access  Private
 */
router.get('/voices', authenticateToken, async (req: Request, res: Response) => {
    try {
        const voices = await voiceService.getVoices();
        res.json({ success: true, data: voices });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/voice/status
 * @desc    Check voice services availability
 * @access  Public
 */
router.get('/status', (req: Request, res: Response) => {
    const status = voiceService.isAvailable();
    res.json({ success: true, data: status });
});

export default router;
