import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    SandpackProvider,
    SandpackCodeEditor,
    SandpackPreview
} from '@codesandbox/sandpack-react';
import { projectsAPI, aiAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
    Loader2, Save, ArrowLeft, Sparkles, Layout, Code2, Copy, Check, Zap,
    Globe, Smartphone, Monitor, Tablet, MessageSquare,
    X, Maximize2, Minimize2, ShoppingBag, User, FileText, Briefcase, Download
} from 'lucide-react';
import JSZip from 'jszip';

type ProjectType = 'component' | 'landing' | 'dashboard' | 'ecommerce' | 'portfolio' | 'blog' | 'saas';
type ViewMode = 'desktop' | 'tablet' | 'mobile';

const PROJECT_TEMPLATES = [
    { id: 'landing', label: 'Landing', icon: Globe, gradient: 'from-violet-600 to-purple-600' },
    { id: 'dashboard', label: 'Dashboard', icon: Layout, gradient: 'from-fuchsia-600 to-pink-600' },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, gradient: 'from-cyan-600 to-blue-600' },
    { id: 'portfolio', label: 'Portfolio', icon: User, gradient: 'from-emerald-600 to-teal-600' },
    { id: 'blog', label: 'Blog', icon: FileText, gradient: 'from-orange-600 to-amber-600' },
    { id: 'saas', label: 'SaaS', icon: Briefcase, gradient: 'from-rose-600 to-red-600' },
];

const DEFAULT_CODE = `export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[150px] animate-pulse" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 mb-8">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-violet-300 text-sm font-medium">AI-Powered Builder</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight text-white">
          Build <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">anything</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Describe what you want to build. Watch it come to life.
        </p>
        <button className="px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all">
          Start Building →
        </button>
      </div>
    </div>
  );
}`;

export default function EditorPage() {
    const { projectId } = useParams();
    const [code, setCode] = useState(DEFAULT_CODE);
    const [sandpackKey, setSandpackKey] = useState(0);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedType, setSelectedType] = useState<ProjectType>('landing');
    const [viewMode, setViewMode] = useState<ViewMode>('desktop');
    const [showCode, setShowCode] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
        { role: 'ai', content: '👋 Welcome! Describe your project and I\'ll generate a complete UI with real images and modern design.' }
    ]);

    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectsAPI.getById(projectId!),
        enabled: !!projectId,
    });

    useEffect(() => {
        if (project?.data.data.code && project.data.data.code !== 'null') {
            setCode(project.data.data.code);
            setSandpackKey(k => k + 1);
        }
    }, [project]);

    const saveMutation = useMutation({
        mutationFn: (newCode: string) => projectsAPI.update(projectId!, { code: newCode }),
    });

    const handleGenerate = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        setMessages(prev => [...prev, { role: 'ai', content: `🔄 Creating your ${selectedType} with AI...` }]);

        try {
            const response = await aiAPI.generateCode({ prompt: prompt.trim(), type: selectedType });
            if (response.data.success && response.data.data.code) {
                const newCode = response.data.data.code;
                setCode(newCode);
                setSandpackKey(k => k + 1);
                saveMutation.mutate(newCode);
                setMessages(prev => prev.slice(0, -1).concat({
                    role: 'ai',
                    content: `✅ Your ${selectedType} is ready! Check the preview. It includes:\n• Modern UI design\n• Real images from Unsplash\n• Responsive layout\n• Smooth animations`
                }));
                setPrompt('');
            } else {
                setMessages(prev => prev.slice(0, -1).concat({ role: 'ai', content: '❌ ' + (response.data.error || 'Failed') }));
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || err.message || 'Generation failed';
            setMessages(prev => prev.slice(0, -1).concat({ role: 'ai', content: '❌ ' + errorMsg }));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = async () => {
        const zip = new JSZip();
        zip.file('src/App.tsx', code);
        zip.file('src/index.tsx', `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\nReactDOM.createRoot(document.getElementById('root')!).render(<App />);`);
        zip.file('src/index.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;');
        zip.file('package.json', JSON.stringify({
            name: project?.data.data.name || 'ai-app',
            version: '1.0.0',
            type: 'module',
            scripts: { dev: 'vite', build: 'vite build' },
            dependencies: { react: '^18.2.0', 'react-dom': '^18.2.0' },
            devDependencies: { '@vitejs/plugin-react': '^4.0.0', tailwindcss: '^3.3.0', vite: '^5.0.0', autoprefixer: '^10.4.0', postcss: '^8.4.0' }
        }, null, 2));
        zip.file('index.html', `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>${project?.data.data.name || 'AI App'}</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/index.tsx"></script>\n</body>\n</html>`);
        zip.file('tailwind.config.js', 'export default {\n  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n};');
        zip.file('vite.config.ts', 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});');
        zip.file('postcss.config.js', 'export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};');
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project?.data.data.name || 'project'}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const examplePrompts: Record<ProjectType, string[]> = {
        component: ['Modern pricing card with images', 'Hero section with background image'],
        landing: ['AI writing tool SaaS with team photos', 'Fitness app with workout images', 'Restaurant landing with food photos'],
        dashboard: ['Analytics dashboard with charts', 'CRM admin panel', 'E-commerce admin with product images'],
        ecommerce: ['Nike-style product page with gallery', 'Fashion store with model photos', 'Tech gadget store'],
        portfolio: ['Developer portfolio with project screenshots', 'Designer portfolio with work samples', 'Photographer portfolio'],
        blog: ['Tech blog with article images', 'Food blog with recipe photos', 'Travel blog with destination images'],
        saas: ['Project management app UI', 'CRM with customer avatars', 'Email marketing dashboard'],
    };

    const sandpackFiles = useMemo(() => {
        // Ensure code has React import for hooks
        let processedCode = code;
        if (!code.includes('import React') && !code.includes('import { ')) {
            // Add React import if using hooks
            if (code.includes('useState') || code.includes('useEffect') || code.includes('useRef') || code.includes('useMemo')) {
                processedCode = `import React, { useState, useEffect, useRef, useMemo } from 'react';\n\n${code}`;
            }
        }

        return {
            '/App.tsx': processedCode,
            '/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        };
    }, [code]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505]">
                <Loader2 className="h-12 w-12 animate-spin text-violet-500" />
            </div>
        );
    }

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-white">
                <Button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-10 bg-gray-900 hover:bg-gray-800">
                    <Minimize2 className="h-4 w-4 mr-2" />Exit
                </Button>
                <SandpackProvider key={`fs-${sandpackKey}`} template="react-ts" theme="light" files={sandpackFiles}
                    options={{ externalResources: ["https://cdn.tailwindcss.com"] }}>
                    <SandpackPreview showOpenInCodeSandbox={false} style={{ height: '100vh', width: '100vw' }} />
                </SandpackProvider>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#050505]/80 backdrop-blur-xl flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">{project?.data.data.name || 'Project'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowCode(!showCode)}
                        className={showCode ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}>
                        <Code2 className="h-4 w-4 mr-1" />Code
                    </Button>

                    <div className="flex bg-white/5 rounded-lg p-0.5 mx-2 border border-white/10">
                        {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => (
                            <button key={mode} onClick={() => setViewMode(mode)}
                                className={`p-1.5 rounded ${viewMode === mode ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                {mode === 'desktop' ? <Monitor className="h-4 w-4" /> : mode === 'tablet' ? <Tablet className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                            </button>
                        ))}
                    </div>

                    <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(true)} className="text-gray-400 hover:text-white hover:bg-white/10">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="text-gray-400 hover:text-white hover:bg-white/10">
                        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleExport} className="text-gray-400 hover:text-white hover:bg-white/10">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => saveMutation.mutate(code)} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                        <Save className="h-4 w-4 mr-1" />Save
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar */}
                {showChat && (
                    <div className="w-80 border-r border-white/5 flex flex-col bg-[#0a0a0a] flex-shrink-0">
                        <button onClick={() => setShowChat(false)} className="absolute right-2 top-16 p-1 text-gray-500 hover:text-white z-10">
                            <X className="h-4 w-4" />
                        </button>

                        {/* Project Types */}
                        <div className="p-4 border-b border-white/5">
                            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Project Type</p>
                            <div className="grid grid-cols-3 gap-2">
                                {PROJECT_TEMPLATES.map((t) => (
                                    <button key={t.id} onClick={() => setSelectedType(t.id as ProjectType)}
                                        className={`p-2 rounded-xl transition-all text-center ${selectedType === t.id
                                            ? `bg-gradient-to-br ${t.gradient} text-white shadow-lg`
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}>
                                        <t.icon className="h-4 w-4 mx-auto mb-0.5" />
                                        <span className="text-[9px] font-medium">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Prompts */}
                        <div className="p-4 border-b border-white/5">
                            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Quick Start</p>
                            <div className="space-y-1.5">
                                {examplePrompts[selectedType]?.slice(0, 3).map((ex, i) => (
                                    <button key={i} onClick={() => setPrompt(ex)}
                                        className="w-full text-left px-3 py-2 text-xs bg-white/5 rounded-lg text-gray-300 hover:bg-white/10 transition-all">
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {messages.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-violet-600/20 text-violet-100 ml-4'
                                    : 'bg-white/5 text-gray-300 mr-4'
                                    }`}>
                                    {msg.content}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5">
                            <form onSubmit={handleGenerate} className="space-y-2">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={`Describe your ${selectedType}...`}
                                    className="w-full h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                                    disabled={isGenerating}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                                />
                                <Button type="submit" disabled={isGenerating || !prompt.trim()}
                                    className="w-full h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-xl">
                                    {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Zap className="h-4 w-4 mr-2" />Generate</>}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {!showChat && (
                    <button onClick={() => setShowChat(true)} className="absolute left-4 bottom-4 z-20 p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl text-white shadow-2xl shadow-violet-500/30 hover:scale-105 transition-all">
                        <MessageSquare className="h-5 w-5" />
                    </button>
                )}

                {/* Editor & Preview */}
                <div className="flex-1 flex overflow-hidden">
                    <SandpackProvider key={sandpackKey} template="react-ts" theme="dark" files={sandpackFiles}
                        options={{ externalResources: ["https://cdn.tailwindcss.com"] }}>
                        {showCode && (
                            <div className="w-1/2 h-full border-r border-white/5">
                                <SandpackCodeEditor showLineNumbers showTabs style={{ height: '100%' }} />
                            </div>
                        )}
                        <div className="flex-1 h-full bg-slate-100 flex items-start justify-center overflow-auto"
                            style={{ padding: viewMode !== 'desktop' ? 24 : 0 }}>
                            <div style={{
                                width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px',
                                height: '100%', minHeight: '100%', backgroundColor: 'white',
                                boxShadow: viewMode !== 'desktop' ? '0 25px 50px -12px rgba(0,0,0,0.25)' : 'none',
                                borderRadius: viewMode !== 'desktop' ? 16 : 0,
                            }}>
                                <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton style={{ height: '100%', width: '100%' }} />
                            </div>
                        </div>
                    </SandpackProvider>
                </div>
            </div>
        </div>
    );
}
