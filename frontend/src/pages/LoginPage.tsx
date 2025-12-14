import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const loginMutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (response) => {
            const { user, token } = response.data.data;
            login(user, token);
            navigate('/dashboard');
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || 'Invalid email or password');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        loginMutation.mutate({ email, password });
    };

    // Demo login for testing
    const handleDemoLogin = () => {
        login(
            {
                id: 'demo-user',
                email: 'demo@aibuilder.dev',
                name: 'Demo User',
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
                        Build <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">stunning apps</span> with AI
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Transform your ideas into production-ready code in seconds.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8">
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">50K+</div>
                            <div className="text-gray-500 text-sm">Apps Built</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">10K+</div>
                            <div className="text-gray-500 text-sm">Developers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">4.9★</div>
                            <div className="text-gray-500 text-sm">Rating</div>
                        </div>
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

                    <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                    <p className="text-gray-500 mb-8">Sign in to continue building amazing apps</p>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            onClick={handleDemoLogin}
                        >
                            <Chrome className="h-5 w-5 mr-2" />
                            Google
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                            onClick={handleDemoLogin}
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-400">Password</Label>
                                <Link to="/forgot-password" className="text-sm text-violet-400 hover:text-violet-300">
                                    Forgot password?
                                </Link>
                            </div>
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
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl text-base font-medium shadow-lg shadow-violet-500/25"
                        >
                            {loginMutation.isPending ? (
                                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Signing in...</>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>

                    {/* Demo Login */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDemoLogin}
                        className="w-full h-12 mt-4 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                    >
                        Try Demo (No Login Required)
                    </Button>

                    <p className="mt-8 text-center text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
                            Sign up free
                        </Link>
                    </p>

                    <p className="mt-4 text-center">
                        <Link to="/pricing" className="text-gray-500 hover:text-white text-sm">
                            View pricing plans →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
