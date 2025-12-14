import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { logger } from '../utils/logger';

export type ProjectType = 'component' | 'landing' | 'dashboard' | 'ecommerce' | 'portfolio' | 'blog' | 'saas' | 'fullstack';

export interface GenerateRequest {
   prompt: string;
   type?: ProjectType;
}

class AIService {
   private openai: OpenAI | null = null;
   private groq: Groq | null = null;

   private getOpenAI(): OpenAI | null {
      if (!this.openai && process.env.OPENAI_API_KEY) {
         this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
         logger.info('✅ OpenAI GPT-4 ready');
      }
      return this.openai;
   }

   private getGroq(): Groq | null {
      if (!this.groq && process.env.GROQ_API_KEY) {
         this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      }
      return this.groq;
   }

   async generateCode(request: GenerateRequest): Promise<{ code: string; provider: string; tokensUsed?: number }> {
      const type = request.type || 'component';
      logger.info(`🎨 Generating ${type}: "${request.prompt.substring(0, 60)}..."`);

      const openai = this.getOpenAI();
      const groq = this.getGroq();
      const systemPrompt = this.getPremiumPrompt(type);

      // Try OpenAI first
      if (openai) {
         try {
            const completion = await openai.chat.completions.create({
               model: 'gpt-4-turbo-preview',
               messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: request.prompt }
               ],
               temperature: 0.8,
               max_tokens: 6000
            });

            let code = completion.choices[0]?.message?.content || '';
            code = this.cleanCode(code);
            logger.info(`✅ OpenAI generated ${code.length} chars`);

            return { code, provider: 'openai', tokensUsed: completion.usage?.total_tokens };
         } catch (error: any) {
            logger.error(`❌ OpenAI error: ${error.message}`);
            // Fall through to try Groq
         }
      }

      // Try Groq as fallback
      if (groq) {
         try {
            logger.info('🔄 Trying Groq fallback...');
            const completion = await groq.chat.completions.create({
               model: 'llama-3.3-70b-versatile',
               messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: request.prompt }
               ],
               temperature: 0.8,
               max_tokens: 6000
            });

            let code = completion.choices[0]?.message?.content || '';
            code = this.cleanCode(code);
            logger.info(`✅ Groq generated ${code.length} chars`);

            return { code, provider: 'groq', tokensUsed: completion.usage?.total_tokens };
         } catch (error: any) {
            logger.error(`❌ Groq error: ${error.message}`);
            throw new Error(`AI generation failed: ${error.message}`);
         }
      }

      throw new Error('No AI provider available. Please check your API keys.');
   }

   private getPremiumPrompt(type: ProjectType): string {
      const designSystem = `
DESIGN SYSTEM - USE THESE EXACT PATTERNS:

COLORS:
- Primary gradient: from-violet-600 via-purple-600 to-fuchsia-500
- Secondary gradient: from-cyan-500 to-blue-600  
- Dark backgrounds: slate-950, slate-900, zinc-900
- Glass effects: bg-white/5 backdrop-blur-xl border border-white/10
- Accent: amber-500, emerald-500 for success, rose-500 for errors

TYPOGRAPHY:
- Headings: font-bold tracking-tight
- Hero text: text-5xl md:text-7xl lg:text-8xl
- Body: text-slate-400 leading-relaxed
- Use text-transparent bg-clip-text for gradient text

SPACING & LAYOUT:
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Section padding: py-24 md:py-32
- Card padding: p-6 md:p-8
- Gap: gap-6 md:gap-8

EFFECTS:
- Shadows: shadow-2xl shadow-purple-500/20
- Hover: hover:scale-105 hover:shadow-xl transition-all duration-300
- Borders: border border-white/10 rounded-2xl md:rounded-3xl
- Glow: Add subtle glow effects with shadows
- Glass: backdrop-blur-xl bg-white/5

ANIMATIONS:
- Use animate-pulse for loading states
- Use transition-all duration-300 for hovers
- Add group hover effects

BUTTONS:
- Primary: px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-105 transition-all
- Secondary: px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all
- Ghost: px-6 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all

CARDS:
- bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all

INPUTS:
- w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`;

      const baseRules = `You are a WORLD-CLASS UI/UX designer and React developer. Create STUNNING, AWARD-WINNING interfaces.

${designSystem}

CRITICAL RULES:
1. Return ONLY valid TypeScript React code - NO markdown, NO explanations
2. ALWAYS start with: import React, { useState, useEffect } from 'react';
3. Then: export default function App() { ... }
4. TailwindCSS ONLY for styling
5. Icons as inline SVG with currentColor
6. Mobile-first responsive design
7. Include micro-interactions and animations
8. Make it look like a $10,000 design

IMAGES - USE REAL IMAGES FROM UNSPLASH:
- For hero images: https://images.unsplash.com/photo-[ID]?w=1600&h=900&fit=crop
- For avatars/team: https://images.unsplash.com/photo-[ID]?w=400&h=400&fit=crop&crop=face
- For product images: https://images.unsplash.com/photo-[ID]?w=800&h=800&fit=crop
- For blog/article images: https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop
- For backgrounds: https://images.unsplash.com/photo-[ID]?w=1920&h=1080&fit=crop

USE THESE UNSPLASH IMAGE IDS (pick appropriate ones):
- Tech/SaaS: 1551434678-e076c223a692, 1553877522-43269d4ea984, 1460925895917-afdab827c52f
- People/Team: 1507003211169-0a1dd7228f2d, 1494790108377-be9c29b29330, 1438761681033-6461ffad8d80
- Business: 1486406146926-c627a92ad1ab, 1497366216548-37526070297c, 1551836022-d5d88e9218df
- Food: 1504674900247-0877df9cc836, 1512621776951-a57141f2eefd, 1476224203421-9ac39bcb3327
- Nature: 1469474968028-56623f02e42e, 1441974231531-c6227db76b6e, 1501854140801-50d01698950b
- Fashion: 1490481651871-ab68de25d43d, 1483985988355-763728e1935b, 1509631179647-0177331693ae
- Fitness: 1517836357463-d25dfeac3438, 1571019614242-c5c5dee9f50b, 1534438327276-14e5300c3a48
- Travel: 1488646953014-85cb44e25828, 1476514525535-07fb3b4ae5f1, 1502920917128-1aa500764cbd
- Office/Work: 1497366811353-6870744d04b2, 1497366216548-37526070297c, 1522071820291-9a6a7e877de9

Always use complete Unsplash URLs with proper dimensions. Make images look professional and relevant to the content.

QUALITY STANDARDS:
- Every element must have hover states
- Use gradient backgrounds creatively
- Add visual hierarchy with size and color
- Include subtle animations
- Make buttons and CTAs stand out
- Use proper spacing and alignment
- Add glass morphism effects
- Include loading/empty states where relevant`;

      const prompts: Record<ProjectType, string> = {
         component: `${baseRules}

Create a PREMIUM, BEAUTIFUL single component. Make it look world-class.`,

         landing: `${baseRules}

Create a STUNNING SaaS landing page with these REQUIRED sections:

1. NAVIGATION (sticky, glass effect)
   - Logo with gradient
   - Nav links with hover effects
   - CTA button with glow

2. HERO SECTION (full viewport, gradient background)
   - Badge/pill with icon
   - Large gradient headline (text-7xl)
   - Subheadline (text-xl text-slate-400)
   - Two CTA buttons (primary + secondary)
   - Visual element (abstract shapes, mockup, or stats)
   - Floating elements with animations

3. LOGOS/SOCIAL PROOF
   - "Trusted by" text
   - Row of company logos (use text or simple shapes)

4. FEATURES (3-4 feature cards)
   - Icon with gradient background
   - Feature title
   - Description
   - Hover animation

5. HOW IT WORKS (3 steps)
   - Step numbers with gradients
   - Titles and descriptions
   - Connecting lines or arrows

6. TESTIMONIALS
   - Quote cards with avatar
   - Name and title
   - Star ratings

7. PRICING (3 tiers)
   - Free, Pro, Enterprise
   - Price with period
   - Feature list with checkmarks
   - CTA buttons
   - "Popular" badge on middle tier

8. FAQ
   - Expandable accordions
   - Icons for open/close

9. CTA SECTION
   - Gradient background
   - Bold headline
   - Final call to action

10. FOOTER
    - Logo
    - Link columns
    - Social icons
    - Copyright

Make it look like Stripe, Linear, or Vercel's landing pages.`,

         dashboard: `${baseRules}

Create a PREMIUM admin dashboard:

1. SIDEBAR (fixed, dark theme)
   - Logo at top
   - Navigation items with icons
   - Active state highlighting
   - User profile at bottom
   - Collapsible on mobile

2. TOP HEADER
   - Search bar with icon
   - Notification bell with badge
   - User avatar dropdown

3. MAIN CONTENT
   - Page title with breadcrumbs
   - Date/time display
   
4. STATS ROW (4 cards)
   - Icon with colored background
   - Stat value (large number)
   - Label
   - Trend indicator (up/down arrow, percentage)
   - Sparkline or mini chart

5. CHARTS SECTION
   - Two chart placeholders (bars, lines)
   - Chart headers with dropdown filters
   
6. DATA TABLE
   - Column headers with sort icons
   - Rows with alternating backgrounds
   - Status badges
   - Action buttons
   - Pagination

7. RECENT ACTIVITY
   - Activity feed with avatars
   - Timestamps
   - Action descriptions

Make it look like a premium B2B SaaS dashboard.`,

         ecommerce: `${baseRules}

Create a PREMIUM e-commerce product page:

1. NAVIGATION
   - Logo, categories, search, cart, account

2. BREADCRUMBS

3. PRODUCT SECTION (two columns)
   Left:
   - Main product image (large, gradient placeholder)
   - Thumbnail gallery
   
   Right:
   - Product title (text-3xl)
   - Star rating with review count
   - Price (large, bold) with strikethrough original
   - Color selector with swatches
   - Size selector with grid
   - Quantity selector
   - Add to cart button (large, primary)
   - Buy now button (secondary)
   - Shipping info
   - Features list with icons

4. TABS
   - Description, Specifications, Reviews

5. RELATED PRODUCTS
   - Product cards with hover effects
   - Image, title, price, add to cart

6. REVIEWS SECTION
   - Overall rating with breakdown
   - Individual reviews with avatars

Make it look like Apple or Nike's product pages.`,

         portfolio: `${baseRules}

Create a STUNNING portfolio website:

1. NAVIGATION (minimal, elegant)

2. HERO (creative, unique)
   - Large name/title
   - Subtitle or tagline
   - Animated elements
   - Social links

3. ABOUT
   - Photo placeholder (gradient circle)
   - Bio text
   - Skills/tech stack icons

4. WORK/PROJECTS (grid with filters)
   - Project cards with hover overlays
   - Category, title, description
   - View project link

5. EXPERIENCE/TIMELINE
   - Timeline or list format
   - Companies, roles, dates

6. TESTIMONIALS
   - Client quotes

7. CONTACT
   - Contact form or email CTA
   - Social links

8. FOOTER (minimal)

Make it look like awwwards.com winning portfolios.`,

         blog: `${baseRules}

Create a BEAUTIFUL blog homepage:

1. NAVIGATION
   - Logo, categories, search, subscribe

2. FEATURED POST (hero layout)
   - Large image placeholder
   - Category tag
   - Title, excerpt
   - Author, date, read time

3. LATEST POSTS (grid or list)
   - Thumbnail images
   - Category badges
   - Titles and excerpts
   - Author avatars
   - Dates

4. NEWSLETTER
   - Gradient background
   - Headline
   - Email input with subscribe button

5. FOOTER
   - Links, social, copyright

Make it look like Medium or Substack.`,

         saas: `${baseRules}

Create a PREMIUM SaaS application UI:

1. TOP NAV
   - Logo, navigation, notifications, user menu

2. SIDEBAR (collapsible)
   - Navigation items with icons
   - Collapse button

3. MAIN WORKSPACE
   - Page header with title and actions
   - Filters/search bar
   
4. DATA VIEW
   - Toggle: grid/list view
   - Cards or table rows
   - Status indicators
   - Action menus

5. EMPTY STATE
   - Illustration placeholder
   - Message and CTA

6. FOOTER/HELP
   - Help button
   - Quick actions

Make it look like Notion, Linear, or Figma.`,

         fullstack: `${baseRules}

Create a complete full-stack application interface with:

1. Authentication screens (login/register)
2. Main dashboard
3. CRUD operations UI
4. Settings page
5. Profile page

Include realistic data placeholders and all interactions.`
      };

      return prompts[type] || prompts.component;
   }

   private cleanCode(code: string): string {
      // Remove markdown
      code = code.replace(/^```(?:tsx?|jsx?|typescript|javascript|react)?\n?/gm, '');
      code = code.replace(/```\s*$/gm, '');

      // Find code start
      const lines = code.split('\n');
      let startIndex = 0;
      for (let i = 0; i < lines.length; i++) {
         const line = lines[i].trim();
         if (line.startsWith('import ') || line.startsWith('export ') ||
            line.startsWith('function ') || line.startsWith('const ') ||
            line.startsWith('//') || line.startsWith('interface ') || line.startsWith('type ')) {
            startIndex = i;
            break;
         }
      }
      code = lines.slice(startIndex).join('\n').trim();

      // Ensure default export
      if (!code.includes('export default')) {
         const funcMatch = code.match(/function\s+(\w+)/);
         const constMatch = code.match(/const\s+(\w+)\s*=/);
         const name = funcMatch?.[1] || constMatch?.[1];
         if (name) code += `\n\nexport default ${name};`;
      }

      // Remove React imports
      code = code.replace(/import\s+React.*?from\s+['"]react['"];?\n?/g, '');
      code = code.replace(/import\s*{[^}]*}\s*from\s+['"]react['"];?\n?/g, '');

      return code.trim();
   }

   async generateLandingPage(description: string) {
      return this.generateCode({ prompt: description, type: 'landing' });
   }

   async generateDashboard(description: string) {
      return this.generateCode({ prompt: description, type: 'dashboard' });
   }

   async improveCode(code: string, instructions: string): Promise<string> {
      const openai = this.getOpenAI();
      if (!openai) throw new Error('OpenAI not configured');

      const completion = await openai.chat.completions.create({
         model: 'gpt-4-turbo-preview',
         messages: [
            { role: 'system', content: 'Improve the code. Return ONLY code.' },
            { role: 'user', content: `Instructions: ${instructions}\n\nCode:\n${code}` }
         ],
         temperature: 0.7,
         max_tokens: 8000
      });

      return this.cleanCode(completion.choices[0]?.message?.content || code);
   }

   async explainCode(code: string): Promise<string> {
      const openai = this.getOpenAI();
      if (!openai) return 'OpenAI not configured';

      const completion = await openai.chat.completions.create({
         model: 'gpt-4-turbo-preview',
         messages: [
            { role: 'system', content: 'Explain this code clearly.' },
            { role: 'user', content: code }
         ],
         max_tokens: 1000
      });

      return completion.choices[0]?.message?.content || '';
   }

   async generateComponent(name: string, desc: string) {
      return (await this.generateCode({ prompt: `Create ${name}: ${desc}`, type: 'component' })).code;
   }
}

export default new AIService();
