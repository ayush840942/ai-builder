import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/authStore';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import EditorPage from '@/pages/EditorPage';
import PricingPage from '@/pages/PricingPage';

function App() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-background">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/editor/:projectId"
                    element={isAuthenticated ? <EditorPage /> : <Navigate to="/login" />}
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
