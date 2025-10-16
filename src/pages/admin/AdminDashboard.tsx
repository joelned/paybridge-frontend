import React from 'react';
import { Shield, LogOut, Users, DollarSign, Settings, Activity } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold">PayBridge Admin</span>
              <p className="text-xs text-gray-600">{userData.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} icon={LogOut}>Logout</Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage the PayBridge platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Merchants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Providers</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {merchants.map((merchant) => (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{merchant.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{merchant.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={merchant.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {merchant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{merchant.volume}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{merchant.providers}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{merchant.joined}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};