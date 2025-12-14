import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from '@/components/CreateProjectDialog';
import {
    Sparkles, Clock, LogOut, Loader2, Plus, Trash2, Code, Layout, Globe,
    ShoppingBag, User, FileText, Briefcase, ArrowRight, Folder, Zap
} from 'lucide-react';

const PROJECT_TYPES = [
    { id: 'landing', label: 'Landing Page', icon: Globe, gradient: 'from-violet-600 to-purple-600', desc: 'Marketing & product pages' },
    { id: 'dashboard', label: 'Dashboard', icon: Layout, gradient: 'from-fuchsia-600 to-pink-600', desc: 'Admin panels & analytics' },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, gradient: 'from-cyan-600 to-blue-600', desc: 'Online stores' },
    { id: 'portfolio', label: 'Portfolio', icon: User, gradient: 'from-emerald-600 to-teal-600', desc: 'Personal websites' },
    { id: 'blog', label: 'Blog', icon: FileText, gradient: 'from-orange-600 to-amber-600', desc: 'Content publishing' },
    { id: 'saas', label: 'SaaS App', icon: Briefcase, gradient: 'from-rose-600 to-red-600', desc: 'Web applications' },
];

export default function DashboardPage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: projectsAPI.getAll,
    });

    const deleteMutation = useMutation({
        mutationFn: projectsAPI.delete,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[150px]" />
            </div>

            {/* Grid Overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Header */}
            <header className="relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50" />
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                        </div>
                        <span className="text-xl font-bold">AI Builder</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/pricing">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer group">
                                <div className="p-1 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30">
                                    <Zap className="h-3 w-3 text-violet-400" />
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-xs font-medium text-violet-200">
                                        {user ? Math.max(0, user.credits - (user.creditsUsed || 0)) : 0} credits
                                    </span>
                                    <span className="text-[10px] text-violet-400/60 group-hover:text-violet-400 transition-colors">
                                        Upgrade plan
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-sm font-medium">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300">{user?.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Welcome */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Welcome back, <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-lg text-gray-500">What would you like to build today?</p>
                </div>

                {/* Quick Start */}
                <div className="mb-16">
                    <h2 className="text-lg font-semibold mb-6 text-gray-400">Quick Start</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {PROJECT_TYPES.map((type) => (
                            <CreateProjectDialog key={type.id} defaultType={type.id}>
                                <button className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 transition-all text-left">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <type.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-medium mb-1">{type.label}</h3>
                                    <p className="text-xs text-gray-500">{type.desc}</p>
                                </button>
                            </CreateProjectDialog>
                        ))}
                    </div>
                </div>

                {/* Recent Projects */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-400">Recent Projects</h2>
                        <CreateProjectDialog>
                            <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/20">
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </Button>
                        </CreateProjectDialog>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                        </div>
                    ) : !projects?.data.data.length ? (
                        <div className="text-center py-20 rounded-3xl bg-white/5 border border-dashed border-white/10">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-violet-600 rounded-2xl blur-xl opacity-30" />
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                    <Folder className="h-10 w-10 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-8">Create your first project to start building with AI</p>
                            <CreateProjectDialog>
                                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-8 py-6 text-lg rounded-xl shadow-lg shadow-violet-500/20">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create First Project
                                </Button>
                            </CreateProjectDialog>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.data.data.map((project: any) => (
                                <div
                                    key={project.id}
                                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-violet-500/50 transition-all"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Code className="h-6 w-6 text-white" />
                                            </div>
                                            <button
                                                onClick={() => deleteMutation.mutate(project.id)}
                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {project.description || 'No description'}
                                        </p>

                                        <div className="flex items-center text-xs text-gray-600 mb-4">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(project.updated_at).toLocaleDateString()}
                                        </div>

                                        <Link to={`/editor/${project.id}`}>
                                            <Button className="w-full bg-white/10 hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 border border-white/10 hover:border-transparent transition-all group-hover:shadow-lg">
                                                Open Editor
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
