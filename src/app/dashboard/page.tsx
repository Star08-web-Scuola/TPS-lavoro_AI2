import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import IntermodalDashboard from '@/components/IntermodalDashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <IntermodalDashboard />
    </ProtectedRoute>
  );
}