import React from 'react';
import { Shield, LogOut, Users, DollarSign, Settings, Activity } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Container } from '../../components/layout/Container';
import { SectionHeader } from '../../components/section/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { type User } from '../../types';

interface AdminDashboardProps {
  userData: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onLogout }) => {
  const stats = [
    { title: 'Total Merchants', value: '1,248', change: '+12.5%', icon: Users, trend: 'up' as const },
    { title: 'Total Volume', value: '$2.4M', change: '+18.2%', icon: DollarSign, trend: 'up' as const },
    { title: 'Active Providers', value: '8', change: '0%', icon: Settings, trend: 'up' as const },
    { title: 'System Health', value: '99.9%', change: '+0.1%', icon: Activity, trend: 'up' as const }
  ];

  const merchants = [
    { id: 1, name: 'Acme Corp', email: 'admin@acme.com', status: 'ACTIVE', volume: '$124,563', providers: 3, joined: '2024-01-15' },
    { id: 2, name: 'TechStart Inc', email: 'hello@techstart.io', status: 'ACTIVE', volume: '$89,231', providers: 2, joined: '2024-02-20' },
    { id: 3, name: 'Global Retail', email: 'contact@globalretail.com', status: 'PENDING_VERIFICATION', volume: '$0', providers: 0, joined: '2024-10-10' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 sticky top-0 z-40">
        <Container className="py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold">PayBridge Admin</span>
              <p className="text-xs text-gray-600 hidden sm:block">{userData.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} icon={LogOut} size="sm">
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </Container>
      </nav>

      <Container className="py-6 sm:py-8">
        <SectionHeader
          title="Admin Dashboard"
          subtitle="Monitor and manage the PayBridge platform"
          className="mb-6 sm:mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        <Card className="mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <SectionHeader title="All Merchants" subtitle="System-wide merchant overview" />
          </div>
          
          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {merchants.map((merchant) => (
              <div key={merchant.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{merchant.name}</p>
                    <p className="text-sm text-gray-600">{merchant.email}</p>
                  </div>
                  <Badge variant={merchant.status === 'ACTIVE' ? 'success' : 'warning'}>
                    {merchant.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Volume:</span>
                    <p className="font-semibold text-gray-900">{merchant.volume}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Providers:</span>
                    <p className="font-semibold text-gray-900">{merchant.providers}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Joined:</span>
                    <p className="text-gray-900">{merchant.joined}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full">Manage</Button>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Providers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{merchant.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{merchant.email}</td>
                    <td className="px-6 py-3">
                      <Badge variant={merchant.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {merchant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">{merchant.volume}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{merchant.providers}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{merchant.joined}</td>
                    <td className="px-6 py-3">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </div>
  );
};