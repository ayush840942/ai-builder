import { Router } from 'express';

const router = Router();

// User routes placeholder
router.get('/profile', (req, res) => {
    res.json({ message: 'User profile endpoint' });
});

export default router;
