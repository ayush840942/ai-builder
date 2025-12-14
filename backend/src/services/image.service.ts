import axios from 'axios';
import { logger } from '../utils/logger';

class ImageService {
    private stabilityKey: string | undefined;
    private huggingfaceKey: string | undefined;

    constructor() {
        this.stabilityKey = process.env.STABILITY_API_KEY;
        this.huggingfaceKey = process.env.HUGGINGFACE_API_KEY;
    }

    /**
     * Generate image using Stability AI
     */
    async generateWithStability(prompt: string, style?: string): Promise<string> {
        if (!this.stabilityKey) {
            throw new Error('Stability API key not configured');
        }

        logger.info(`🎨 Generating image with Stability: "${prompt.substring(0, 50)}..."`);

        const response = await axios.post(
            'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
            {
                text_prompts: [
                    { text: prompt, weight: 1 },
                    { text: 'blurry, bad quality, distorted', weight: -1 }
                ],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                steps: 30,
                samples: 1,
                style_preset: style || 'digital-art'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.stabilityKey}`,
                    'Accept': 'application/json'
                }
            }
        );

        const base64Image = response.data.artifacts[0].base64;
        logger.info('✅ Stability image generated');
        return `data:image/png;base64,${base64Image}`;
    }

    /**
     * Generate image using HuggingFace
     */
    async generateWithHuggingFace(prompt: string, model?: string): Promise<string> {
        if (!this.huggingfaceKey) {
            throw new Error('HuggingFace API key not configured');
        }

        const modelId = model || 'stabilityai/stable-diffusion-xl-base-1.0';
        logger.info(`🎨 Generating image with HuggingFace: "${prompt.substring(0, 50)}..."`);

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${modelId}`,
            { inputs: prompt },
            {
                headers: {
                    'Authorization': `Bearer ${this.huggingfaceKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        const base64 = Buffer.from(response.data).toString('base64');
        logger.info('✅ HuggingFace image generated');
        return `data:image/png;base64,${base64}`;
    }

    /**
     * Generate image with fallback
     */
    async generate(prompt: string, options?: { style?: string; provider?: 'stability' | 'huggingface' }): Promise<{ image: string; provider: string }> {
        const provider = options?.provider;

        // Try specified provider or Stability first
        if (provider === 'huggingface' || !this.stabilityKey) {
            try {
                const image = await this.generateWithHuggingFace(prompt);
                return { image, provider: 'huggingface' };
            } catch (error: any) {
                logger.error(`HuggingFace error: ${error.message}`);
                if (this.stabilityKey) {
                    const image = await this.generateWithStability(prompt, options?.style);
                    return { image, provider: 'stability' };
                }
                throw error;
            }
        }

        try {
            const image = await this.generateWithStability(prompt, options?.style);
            return { image, provider: 'stability' };
        } catch (error: any) {
            logger.error(`Stability error: ${error.message}`);
            if (this.huggingfaceKey) {
                const image = await this.generateWithHuggingFace(prompt);
                return { image, provider: 'huggingface' };
            }
            throw error;
        }
    }
}

export default new ImageService();
