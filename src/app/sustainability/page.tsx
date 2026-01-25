import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SustainabilityReporting from '@/components/SustainabilityReporting';

export default function SustainabilityPage() {
  return (
    <ProtectedRoute>
      <SustainabilityReporting />
    </ProtectedRoute>
  );
}