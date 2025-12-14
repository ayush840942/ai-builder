import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Code, Zap, Globe, Layers, ArrowRight, Play, Star } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-transparent to-fuchsia-900/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-3 border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50" />
                                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <span className="text-xl font-bold">AI Builder</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                            <a href="#how" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
                            <Link to="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" className="text-gray-300 hover:text-white">
                                    Log in
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 border-0 shadow-lg shadow-violet-500/25">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-8">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-medium">
                            Powered by GPT-4 & Advanced AI
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
                        <span className="block text-white">Build</span>
                        <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            Stunning Apps
                        </span>
                        <span className="block text-white">With AI</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Transform your ideas into fully functional websites and applications.
                        Just describe what you want — AI creates production-ready code instantly.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link to="/register">
                            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105 group">
                                Start Building Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/30">
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-12 mb-20">
                        {[
                            { value: '50K+', label: 'Apps Built' },
                            { value: '99.9%', label: 'Uptime' },
                            { value: '4.9', label: 'Rating', icon: Star },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent flex items-center justify-center gap-1">
                                    {stat.value}
                                    {stat.icon && <stat.icon className="h-6 w-6 text-yellow-400 fill-yellow-400" />}
                                </div>
                                <div className="text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Preview Window */}
                    <div className="relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="h-12 bg-gray-900/50 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 bg-white/5 rounded-full text-xs text-gray-500">
                                        app.aibuilder.dev
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 space-y-3">
                                        <div className="h-8 bg-violet-500/20 rounded-lg animate-pulse" />
                                        <div className="h-6 bg-white/5 rounded-lg" />
                                        <div className="h-6 bg-white/5 rounded-lg" />
                                        <div className="h-6 bg-white/5 rounded-lg" />
                                    </div>
                                    <div className="col-span-3 space-y-4">
                                        <div className="h-32 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-white/5" />
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                                            <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                                            <div className="h-24 bg-white/5 rounded-xl border border-white/5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Build anything you imagine
                            </span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Powerful AI that understands your vision and creates pixel-perfect implementations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Code,
                                title: 'AI Code Generation',
                                desc: 'Describe your app in plain English. GPT-4 generates production-ready React code.',
                                gradient: 'from-violet-600 to-purple-600'
                            },
                            {
                                icon: Zap,
                                title: 'Live Preview',
                                desc: 'See your app come to life in real-time with instant preview and hot reload.',
                                gradient: 'from-fuchsia-600 to-pink-600'
                            },
                            {
                                icon: Globe,
                                title: 'One-Click Deploy',
                                desc: 'Export to ZIP or deploy directly to Vercel, Netlify, or your own server.',
                                gradient: 'from-cyan-600 to-blue-600'
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Build Types */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            From idea to production in minutes
                        </h2>
                        <p className="text-gray-500 text-lg">Choose what you want to build</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Layers, label: 'Landing Pages', count: '1,200+ built' },
                            { icon: Globe, label: 'Dashboards', count: '850+ built' },
                            { icon: Code, label: 'E-commerce', count: '600+ built' },
                            { icon: Zap, label: 'SaaS Apps', count: '400+ built' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <item.icon className="h-8 w-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-lg mb-1">{item.label}</h3>
                                <p className="text-sm text-gray-500">{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative p-12 md:p-20 rounded-[2.5rem] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600" />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
                        <div className="relative text-center">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Ready to build something amazing?
                            </h2>
                            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
                                Join thousands of developers and designers building with AI
                            </p>
                            <Link to="/register">
                                <Button size="lg" className="text-lg px-12 py-7 bg-white text-violet-600 hover:bg-gray-100 rounded-2xl shadow-2xl hover:scale-105 transition-all font-semibold">
                                    Start Building Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold">AI Builder</span>
                    </div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                    <p className="text-sm text-gray-600">© 2024 AI Builder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
