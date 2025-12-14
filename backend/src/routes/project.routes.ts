import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';
import { supabase } from '../config/supabase';

const router = Router();

// In-memory storage for demo users
const demoProjects: Map<string, any> = new Map();
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

// Helper to check if it's a demo user
function isDemoUser(userId: string): boolean {
    return userId === DEMO_USER_ID;
}

// Validation schemas
const createProjectSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    framework: z.enum(['react', 'vue', 'svelte', 'html']).optional(),
    template: z.string().optional()
});

const updateProjectSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    code: z.string().optional(),
    published: z.boolean().optional()
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects for authenticated user
 * @access  Private
 */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        // Demo user - use in-memory storage
        if (isDemoUser(userId)) {
            const userProjects = Array.from(demoProjects.values())
                .filter(p => p.user_id === userId)
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

            return res.json({
                success: true,
                data: userProjects
            });
        }

        // Real user - use Supabase
        const { data: userProjects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: userProjects
        });
    } catch (error: any) {
        console.error('Fetch Projects Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch projects'
        });
    }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get a specific project
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const projectId = req.params.id;

        // Demo user
        if (isDemoUser(userId)) {
            const project = demoProjects.get(projectId);
            if (!project || project.user_id !== userId) {
                return res.status(404).json({
                    success: false,
                    error: 'Project not found'
                });
            }
            return res.json({
                success: true,
                data: project
            });
        }

        // Real user
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', userId)
            .single();

        if (error || !project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch project'
        });
    }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post(
    '/',
    authenticateToken,
    validateRequest(createProjectSchema),
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { name, description, framework, template } = req.body;

            // Check project limit for Demo User
            if (isDemoUser(userId)) {
                const userProjectCount = Array.from(demoProjects.values()).filter(p => p.user_id === userId).length;
                if (userProjectCount >= 2) {
                    return res.status(403).json({
                        success: false,
                        error: 'Free plan limit reached. Upgrade to create more projects.',
                        code: 'LIMIT_REACHED'
                    });
                }

                const projectId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const now = new Date().toISOString();

                const project = {
                    id: projectId,
                    user_id: userId,
                    name,
                    description: description || '',
                    framework: framework || 'react',
                    template: template || null,
                    code: '',
                    published: false,
                    created_at: now,
                    updated_at: now
                };

                demoProjects.set(projectId, project);

                return res.status(201).json({
                    success: true,
                    data: project
                });
            }

            // Check project limit for Real User
            const { count } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (count !== null && count >= 2) {
                // Check user plan
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('plan')
                    .eq('id', userId)
                    .single();

                if (profile?.plan === 'free') {
                    return res.status(403).json({
                        success: false,
                        error: 'Free plan limit reached. Upgrade to create more projects.',
                        code: 'LIMIT_REACHED'
                    });
                }
            }

            // Real user - use Supabase
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    {
                        user_id: userId,
                        name,
                        description: description || '',
                        framework: framework || 'react',
                        template: template || null,
                        code: '',
                        published: false
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                success: true,
                data: data
            });
        } catch (error: any) {
            console.error('Create Project Error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to create project'
            });
        }
    }
);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update a project
 * @access  Private
 */
router.put(
    '/:id',
    authenticateToken,
    validateRequest(updateProjectSchema),
    async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const projectId = req.params.id;

            // Demo user
            if (isDemoUser(userId)) {
                const existingProject = demoProjects.get(projectId);
                if (!existingProject || existingProject.user_id !== userId) {
                    return res.status(404).json({
                        success: false,
                        error: 'Project not found'
                    });
                }

                const updatedProject = {
                    ...existingProject,
                    ...req.body,
                    updated_at: new Date().toISOString()
                };
                demoProjects.set(projectId, updatedProject);

                return res.json({
                    success: true,
                    data: updatedProject
                });
            }

            // Real user
            const { data: existing, error: fetchError } = await supabase
                .from('projects')
                .select('id')
                .eq('id', projectId)
                .eq('user_id', userId)
                .single();

            if (fetchError || !existing) {
                return res.status(404).json({
                    success: false,
                    error: 'Project not found'
                });
            }

            const updates: any = { ...req.body, updated_at: new Date().toISOString() };

            const { data, error } = await supabase
                .from('projects')
                .update(updates)
                .eq('id', projectId)
                .select()
                .single();

            if (error) throw error;

            res.json({
                success: true,
                data: data
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to update project'
            });
        }
    }
);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const projectId = req.params.id;

        // Demo user
        if (isDemoUser(userId)) {
            const project = demoProjects.get(projectId);
            if (!project || project.user_id !== userId) {
                return res.status(404).json({
                    success: false,
                    error: 'Project not found'
                });
            }
            demoProjects.delete(projectId);
            return res.json({
                success: true,
                message: 'Project deleted successfully'
            });
        }

        // Real user
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .eq('user_id', userId);

        if (error) throw error;

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete project'
        });
    }
});

export default router;
