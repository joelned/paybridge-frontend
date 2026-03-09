import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../../components/common/Card';
import type { User } from '../../../types/auth';
import { merchantService } from '../../../services/merchantService';
import { InlineAlert } from '../../../components/feedback/InlineAlert';
import { AlertCircle } from 'lucide-react';
import { getErrorMessage } from '../../../utils/errorHandler';
import { formatDate, formatStatus } from '../../../utils/formatters';
import { Badge } from '../../../components/common/Badge';

interface SettingsTabProps {
  userData: User;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ userData }) => {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['merchant-profile'],
    queryFn: () => merchantService.getMerchantProfile(),
    staleTime: 60 * 1000,
  });

  const statusVariant = (status?: string): 'success' | 'warning' | 'danger' | 'default' => {
    if (!status) {
      return 'default';
    }
    if (status === 'ACTIVE') {
      return 'success';
    }
    if (status.includes('SUSPENDED') || status.includes('REJECTED') || status.includes('INACTIVE')) {
      return 'danger';
    }
    return 'warning';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ui-page-title">Account</h1>
        <p className="ui-page-subtitle mt-1">
          Manage merchant account details, integration access, and security guidance.
        </p>
      </div>

      {profileError && (
        <InlineAlert variant="error" icon={AlertCircle} className="bg-red-50 border-red-300 text-red-800">
          {getErrorMessage(profileError)}
        </InlineAlert>
      )}

      <Card className="p-6">
        {profileLoading ? (
          <p className="text-sm text-slate-600">Loading profile...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h2 className="ui-section-title">Business Profile</h2>
              <Badge
                variant={statusVariant(profile?.status)}
                className={profile?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : ''}
              >
                {profile?.status ? formatStatus(profile.status) : 'Unknown'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{userData.userType}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Business Name</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile?.businessName || userData.businessName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{profile?.email || userData.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Business Type</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{profile?.businessType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Country</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{profile?.businessCountry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Website</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{profile?.websiteUrl || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Joined</p>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  {profile?.createdAt ? formatDate(profile.createdAt, 'long') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SettingsTab;
