import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Zap, Crown, ArrowRight } from 'lucide-react';

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        credits: 10,
        description: 'Perfect for trying out AI Builder',
        features: [
            '10 AI generations/month',
            'Basic templates',
            'Code export (ZIP)',
            'Community support',
            'Sandpack preview',
        ],
        notIncluded: [
            'Priority generation',
            'Advanced templates',
            'Custom domains',
            'Team collaboration',
        ],
        cta: 'Get Started Free',
        popular: false,
        gradient: 'from-slate-600 to-slate-700',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$19',
        period: '/month',
        credits: 100,
        description: 'For developers and designers',
        features: [
            '100 AI generations/month',
            'All templates',
            'Code export (ZIP)',
            'Priority support',
            'Priority generation queue',
            'Advanced customization',
            'Image generation',
            'Voice features',
        ],
        notIncluded: [
            'Custom domains',
            'Team collaboration',
        ],
        cta: 'Start Pro Trial',
        popular: true,
        gradient: 'from-violet-600 to-fuchsia-600',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$99',
        period: '/month',
        credits: 1000,
        description: 'For teams and agencies',
        features: [
            'Unlimited AI generations',
            'All templates + custom',
            'Code export (all formats)',
            'Dedicated support',
            'Instant generation',
            'Full customization',
            'All AI features',
            'Custom domains',
            'Team collaboration (10 seats)',
            'API access',
            'White-label options',
        ],
        notIncluded: [],
        cta: 'Contact Sales',
        popular: false,
        gradient: 'from-amber-500 to-orange-600',
    },
];

export default function PricingPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleSelectPlan = (planId: string) => {
        if (!isAuthenticated) {
            navigate('/register');
            return;
        }

        if (planId === 'free') {
            navigate('/dashboard');
        } else if (planId === 'enterprise') {
            window.open('mailto:sales@aibuilder.dev?subject=Enterprise Plan', '_blank');
        } else {
            // For pro plan, you would integrate Stripe here
            alert('Pro plan coming soon! For now, enjoy free tier.');
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">AI Builder</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-300">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Pricing Section */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                            <Zap className="h-4 w-4 text-violet-400" />
                            <span className="text-sm text-violet-300">Simple, transparent pricing</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Choose your <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">plan</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Start free and upgrade as you grow. All plans include access to our AI-powered code generation.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 ${plan.popular
                                    ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-2 border-violet-500/50'
                                    : 'bg-white/5 border border-white/10'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="px-4 py-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Crown className="h-3 w-3" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                    <p className="text-gray-500 text-sm">{plan.description}</p>
                                </div>

                                <div className="mb-6">
                                    <span className="text-5xl font-bold">{plan.price}</span>
                                    <span className="text-gray-500">{plan.period}</span>
                                </div>

                                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Credits/month</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                            {plan.credits === 1000 ? 'Unlimited' : plan.credits}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    className={`w-full h-12 rounded-xl font-semibold mb-8 ${plan.popular
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25'
                                        : 'bg-white/10 hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>

                                <div className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                    {plan.notIncluded.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3 opacity-40">
                                            <Check className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-500 line-through">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'What are credits?', a: 'Credits are used for AI generations. Each time you generate code, images, or use AI features, you use 1 credit. Credits reset monthly.' },
                                { q: 'Can I upgrade or downgrade anytime?', a: 'Yes! You can change your plan at any time. When upgrading, you\'ll be prorated. When downgrading, changes take effect next billing cycle.' },
                                { q: 'What happens if I run out of credits?', a: 'You\'ll need to wait until your credits reset next month, or upgrade to a higher plan for more credits.' },
                                { q: 'Do unused credits roll over?', a: 'No, credits reset each month. We recommend using them before your billing cycle ends!' },
                            ].map((faq, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                                    <p className="text-gray-400 text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto text-center text-gray-600">
                    © 2024 AI Builder. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
