import { Router, Request, Response } from 'express';
import aiService from '../services/ai.service';
import { authenticateToken } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

// Credit cost per generation
const GENERATION_COST = 2;

// Helper to check and deduct credits
async function checkAndDeductCredits(userId: string, cost: number): Promise<{ allowed: boolean; error?: string }> {
    // Demo user: simulate free plan limits (mock)
    if (userId === '00000000-0000-0000-0000-000000000000' || userId.startsWith('demo-')) {
        // We could implement in-memory tracking for demo, but let's allow it for now
        // or we could block if we want to force signup
        return { allowed: true };
    }

    // Real user
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits, plan')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        return { allowed: false, error: 'User profile not found' };
    }

    // Unlimited for paid plans (example)
    if (profile.plan === 'pro') return { allowed: true };

    if (profile.credits < cost) {
        return { allowed: false, error: `Not enough credits. Required: ${cost}, Available: ${profile.credits}` };
    }

    // Deduct credits
    // We use rpc 'decrement_credits' if concurrency is an issue, but standard update is fine for this scale
    const { error: updateError } = await supabase
        .rpc('deduct_credits', { user_uuid: userId, amount: cost });

    // Fallback if RPC doesn't exist (I'll create it via SQL or use direct update)
    if (updateError) {
        // Try direct update
        const { error: directError } = await supabase
            .from('profiles')
            .update({ credits: profile.credits - cost })
            .eq('id', userId);

        if (directError) return { allowed: false, error: 'Failed to update credits' };
    }

    return { allowed: true };
}

/**
 * @route   POST /api/ai/generate
 * @desc    Generate code from natural language prompt
 * @access  Private
 */
router.post('/generate', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { prompt, type } = req.body;
        const userId = (req as any).user.userId;

        if (!prompt) {
            return res.status(400).json({ success: false, error: 'Prompt is required' });
        }

        // Check credits
        const { allowed, error: creditError } = await checkAndDeductCredits(userId, GENERATION_COST);
        if (!allowed) {
            return res.status(402).json({
                success: false,
                error: creditError || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        console.log(`[AI] Generating ${type || 'component'}: "${prompt.substring(0, 60)}..."`);

        const result = await aiService.generateCode({
            prompt,
            type: type || 'component',
        });

        console.log(`[AI] ✅ Generated ${result.code.length} chars`);

        res.json({ success: true, data: result });
    } catch (error: any) {
        console.error('[AI] ❌ Error:', error.message);
        res.status(500).json({ success: false, error: error.message || 'Generation failed' });
    }
});

/**
 * @route   POST /api/ai/landing
 * @desc    Generate a complete landing page
 * @access  Private
 */
router.post('/landing', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        const userId = (req as any).user.userId;

        if (!description) {
            return res.status(400).json({ success: false, error: 'Description is required' });
        }

        // Check credits
        const { allowed, error: creditError } = await checkAndDeductCredits(userId, GENERATION_COST);
        if (!allowed) {
            return res.status(402).json({
                success: false,
                error: creditError || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        const result = await aiService.generateLandingPage(description);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/ai/dashboard
 * @desc    Generate a complete dashboard
 * @access  Private
 */
router.post('/dashboard', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { description } = req.body;
        const userId = (req as any).user.userId;

        if (!description) {
            return res.status(400).json({ success: false, error: 'Description is required' });
        }

        // Check credits
        const { allowed, error: creditError } = await checkAndDeductCredits(userId, GENERATION_COST);
        if (!allowed) {
            return res.status(402).json({
                success: false,
                error: creditError || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        const result = await aiService.generateDashboard(description);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/ai/improve
 * @desc    Improve existing code
 * @access  Private
 */
router.post('/improve', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { code, instructions } = req.body;
        const userId = (req as any).user.userId;

        // Check credits for improvements too? Usually yes.
        const { allowed, error: creditError } = await checkAndDeductCredits(userId, GENERATION_COST);
        if (!allowed) {
            return res.status(402).json({
                success: false,
                error: creditError || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        const improvedCode = await aiService.improveCode(code, instructions);
        res.json({ success: true, data: { code: improvedCode } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/ai/explain
 * @desc    Explain code (Optional: maybe lower cost or free?)
 * @access  Private
 */
router.post('/explain', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        // Explanation might be cheaper, let's say 1 credit or free. 
        // User asked "every live chat deduct 2 credits".
        // Ensure we follow the rule. Let's make it 2 for now to be safe.
        const userId = (req as any).user.userId;
        const { allowed, error: creditError } = await checkAndDeductCredits(userId, 2);

        if (!allowed) {
            return res.status(402).json({
                success: false,
                error: creditError || 'Insufficient credits',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        const explanation = await aiService.explainCode(code);
        res.json({ success: true, data: { explanation } });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
