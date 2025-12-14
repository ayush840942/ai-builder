import axios from 'axios';
import { logger } from '../utils/logger';

class VoiceService {
    private elevenLabsKey: string | undefined;
    private deepgramKey: string | undefined;

    constructor() {
        this.elevenLabsKey = process.env.ELEVENLABS_API_KEY;
        this.deepgramKey = process.env.DEEPGRAM_API_KEY;
    }

    /**
     * Text-to-Speech using ElevenLabs
     */
    async textToSpeech(text: string, voiceId?: string): Promise<Buffer> {
        if (!this.elevenLabsKey) {
            throw new Error('ElevenLabs API key not configured');
        }

        logger.info(`🎤 Converting text to speech: "${text.substring(0, 50)}..."`);

        // Default to "Rachel" voice if not specified
        const voice = voiceId || '21m00Tcm4TlvDq8ikWAM';

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
            {
                text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': this.elevenLabsKey
                },
                responseType: 'arraybuffer'
            }
        );

        logger.info('✅ Text-to-speech generated');
        return Buffer.from(response.data);
    }

    /**
     * Get available voices from ElevenLabs
     */
    async getVoices(): Promise<any[]> {
        if (!this.elevenLabsKey) {
            return [];
        }

        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': this.elevenLabsKey }
        });

        return response.data.voices;
    }

    /**
     * Speech-to-Text using Deepgram
     */
    async speechToText(audioBuffer: Buffer, mimeType?: string): Promise<string> {
        if (!this.deepgramKey) {
            throw new Error('Deepgram API key not configured');
        }

        logger.info('🎧 Converting speech to text...');

        const response = await axios.post(
            'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true',
            audioBuffer,
            {
                headers: {
                    'Authorization': `Token ${this.deepgramKey}`,
                    'Content-Type': mimeType || 'audio/wav'
                }
            }
        );

        const transcript = response.data.results?.channels[0]?.alternatives[0]?.transcript || '';
        logger.info(`✅ Transcribed: "${transcript.substring(0, 50)}..."`);
        return transcript;
    }

    /**
     * Check if voice services are available
     */
    isAvailable(): { tts: boolean; stt: boolean } {
        return {
            tts: !!this.elevenLabsKey,
            stt: !!this.deepgramKey
        };
    }
}

export default new VoiceService();
