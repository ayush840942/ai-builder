import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Sparkles, Loader2 } from 'lucide-react';

interface CreateProjectDialogProps {
    children?: React.ReactNode;
    defaultType?: string;
}

export function CreateProjectDialog({ children, defaultType }: CreateProjectDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState(defaultType ? `AI ${defaultType} project` : '');

    const [error, setError] = useState('');

    const createMutation = useMutation({
        mutationFn: projectsAPI.create,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setOpen(false);
            setName('');
            setDescription('');
            setError('');
            navigate(`/editor/${response.data.data.id}`);
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || 'Failed to create project');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setError('');
        createMutation.mutate({ name, description });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setError(''); }}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/20">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-white/10 text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50" />
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <DialogTitle className="text-2xl">Create Project</DialogTitle>
                        </div>
                        <DialogDescription className="text-gray-500">
                            Give your project a name and start building with AI.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-400">Project Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Awesome App"
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-400">
                                Description <span className="text-gray-600">(optional)</span>
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief description of what you're building"
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setOpen(false)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || !name.trim()}
                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/20"
                        >
                            {createMutation.isPending ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
