import IntermodalDashboard from '@/components/IntermodalDashboard';
import { redirect } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <IntermodalDashboard />
    </div>
  );
}