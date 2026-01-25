import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AIRouteOptimizer from '@/components/AIRouteOptimizer';

export default function RouteOptimizerPage() {
  return (
    <ProtectedRoute>
      <AIRouteOptimizer />
    </ProtectedRoute>
  );
}