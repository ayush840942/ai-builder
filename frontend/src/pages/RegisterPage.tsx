import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, User, Github, Chrome, Check } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const registerMutation = useMutation({
        mutationFn: authAPI.register,
        onSuccess: (response) => {
            const { user, token } = response.data.data;
            login(user, token);
            navigate('/dashboard');
        },
        onError: (err: any) => setError(err.response?.data?.error || 'Registration failed'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        registerMutation.mutate({ name, email, password });
    };

    // Demo registration
    const handleDemoRegister = () => {
        login(
            {
                id: 'demo-user-' + Date.now(),
                email: 'demo@aibuilder.dev',
                name: name || 'Demo User',
                plan: 'free',
                credits: 10,
                creditsUsed: 0,
                createdAt: new Date().toISOString(),
            },
            'demo-token'
        );
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[150px]" />
            </div>

            {/* Grid Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors w-fit">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to home
                </Link>

                <div className="max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Start building <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">for free</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Create stunning websites and apps with the power of AI. No credit card required.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {[
                            '10 free AI generations per month',
                            'Access to all basic templates',
                            'Export your code anytime',
                            'No credit card required',
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-emerald-400" />
                                </div>
                                <span className="text-gray-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-gray-600 text-sm">© 2024 AI Builder. All rights reserved.</p>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Back Link */}
                    <Link to="/" className="lg:hidden inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to home
                    </Link>

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50" />
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold">AI Builder</span>
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                    <p className="text-gray-500 mb-8">Start building amazing apps with AI today</p>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            onClick={handleDemoRegister}
                        >
                            <Chrome className="h-5 w-5 mr-2" />
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            onClick={handleDemoRegister}
                        >
                            <Github className="h-5 w-5 mr-2" />
                            GitHub
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#050505] text-gray-500">or continue with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-400">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-400">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-400">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                                    required
                                    minLength={8}
                                />
                            </div>
                            <p className="text-xs text-gray-600">Must be at least 8 characters</p>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl text-base font-medium shadow-lg shadow-violet-500/25"
                        >
                            {registerMutation.isPending ? (
                                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Creating account...</>
                            ) : (
                                'Create free account'
                            )}
                        </Button>
                    </form>

                    {/* Demo */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDemoRegister}
                        className="w-full h-12 mt-4 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                    >
                        Try Demo (No Signup Required)
                    </Button>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-violet-400 hover:text-violet-300">Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>
                    </p>

                    <p className="mt-6 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
