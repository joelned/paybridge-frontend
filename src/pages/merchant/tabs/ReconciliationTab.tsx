import React, { useMemo } from 'react';
import { RefreshCw, Download, AlertTriangle, CheckCircle, TrendingUp, Clock, Search, Filter, MoreHorizontal, Eye, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { useModalContext } from '../../../contexts/ModalContext';
import { DebouncedSearchInput } from '../../../components/common/DebouncedSearchInput';
import { useSearchState } from '../../../hooks/useSearchState';
import { useReconciliationRecords } from '../../../hooks/queries';

export const ReconciliationTab: React.FC = () => {
  const { openModal } = useModalContext();
  const { debouncedQuery, handleSearch, isSearching } = useSearchState({ delay: 500 });
  const { data: reconciliationData, isLoading, error } = useReconciliationRecords();
  
  const reconciliations = reconciliationData?.records || [];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: <CheckCircle size={16} className="text-emerald-600" />,
          variant: 'success' as const,
          color: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200'
        };
      case 'IN_PROGRESS':
        return {
          icon: <Clock size={16} className="text-amber-600 animate-pulse" />,
          variant: 'warning' as const,
          color: 'text-amber-700',
          bg: 'bg-amber-50',
          border: 'border-amber-200'
        };
      case 'FAILED':
        return {
          icon: <AlertTriangle size={16} className="text-red-600" />,
          variant: 'danger' as const,
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      default:
        return {
          icon: <Clock size={16} className="text-slate-600" />,
          variant: 'default' as const,
          color: 'text-slate-700',
          bg: 'bg-slate-50',
          border: 'border-slate-200'
        };
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredReconciliations = useMemo(() => {
    return reconciliations.filter(recon =>
      recon.providerId.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      recon.id.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [reconciliations, debouncedQuery]);

  const summary = reconciliationData?.summary;
  const totalMatched = summary?.matchedRecords || 0;
  const totalUnmatched = summary?.unmatchedRecords || 0;
  const totalDiscrepancies = summary?.disputedRecords || 0;
  const overallAccuracy = summary?.totalRecords ? ((summary.matchedRecords / summary.totalRecords) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Premium Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Transaction Reconciliation
              </h1>
              <p className="text-slate-600 font-medium">Automated matching and verification across payment providers</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" icon={Download} className="shadow-sm hover:shadow-md transition-all duration-200">
                Export Report
              </Button>
              <Button 
                variant="primary" 
                icon={RefreshCw} 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => openModal('runReconciliation')}
              >
                Run Reconciliation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Premium Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Matched Transactions */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle className="text-emerald-600" size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
                  <TrendingUp size={16} />
                  <span>+12%</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Matched Transactions</h3>
                <p className="text-3xl font-bold text-slate-900">{totalMatched.toLocaleString()}</p>
                <p className="text-slate-500 text-sm font-medium">Successfully reconciled</p>
              </div>
            </div>
          </div>

          {/* Unmatched Transactions */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="text-amber-600" size={24} />
                </div>
                <div className="flex items-center gap-1 text-amber-600 text-sm font-semibold">
                  <span>Pending</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Unmatched</h3>
                <p className="text-3xl font-bold text-slate-900">{totalUnmatched}</p>
                <p className="text-slate-500 text-sm font-medium">Require attention</p>
              </div>
            </div>
          </div>

          {/* Discrepancies */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
                  <AlertCircle size={16} />
                  <span>Critical</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Discrepancies</h3>
                <p className="text-3xl font-bold text-slate-900">{totalDiscrepancies}</p>
                <p className="text-slate-500 text-sm font-medium">Need investigation</p>
              </div>
            </div>
          </div>

          {/* Accuracy Rate */}
          <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <TrendingUp className="text-indigo-600" size={24} />
                </div>
                <div className="flex items-center gap-1 text-indigo-600 text-sm font-semibold">
                  <span>Excellent</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Accuracy Rate</h3>
                <p className="text-3xl font-bold text-slate-900">{overallAccuracy.toFixed(1)}%</p>
                <p className="text-slate-500 text-sm font-medium">Overall precision</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Reconciliation History</h3>
                <p className="text-slate-600 text-sm font-medium mt-1">Recent transaction matching results</p>
              </div>
              <div className="flex items-center gap-3">
                <DebouncedSearchInput
                  placeholder="Search reconciliations..."
                  onSearch={handleSearch}
                  delay={500}
                  className="w-64"
                  isLoading={isSearching}
                />
                <Button variant="outline" icon={Filter} size="sm" className="shadow-sm">
                  Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Matched</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Unmatched</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Issues</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-8 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading reconciliation data...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="px-8 py-12 text-center">
                      <p className="text-red-600">Error loading reconciliation data</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </td>
                  </tr>
                ) : filteredReconciliations.map((recon, index) => {
                  const statusConfig = getStatusConfig(recon.status);
                  const isMatched = recon.status === 'MATCHED';
                  const hasDiscrepancy = recon.discrepancy;
                  return (
                    <tr key={recon.id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {recon.providerId.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{recon.providerId}</p>
                            <p className="text-xs text-slate-500 font-medium">Payment Gateway</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">{new Date(recon.reconciliationDate).toLocaleDateString()}</p>
                          <p className="text-sm text-slate-500 font-medium">{new Date(recon.reconciliationDate).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${statusConfig.bg} ${statusConfig.border} border`}>
                          {statusConfig.icon}
                          <span className={`text-sm font-semibold ${statusConfig.color}`}>
                            {formatStatus(recon.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="font-bold text-emerald-700">{isMatched ? '1' : '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="font-bold text-amber-700">{!isMatched ? '1' : '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-bold text-red-700">{hasDiscrepancy ? '1' : '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="font-bold text-slate-900 text-lg">{recon.internalAmount} {recon.currency}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                isMatched ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${isMatched ? 100 : 0}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${
                            isMatched ? 'text-emerald-700' : 'text-red-700'
                          }`}>
                            {isMatched ? '100%' : '0%'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Eye}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() => openModal('info', { title: 'Reconciliation Details', message: `Details for ${recon.providerId} reconciliation on ${new Date(recon.reconciliationDate).toLocaleDateString()}` })}
                          >
                            View
                          </Button>
                          {recon.status === 'UNMATCHED' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              icon={RotateCcw}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-amber-50 hover:text-amber-700"
                              onClick={() => openModal('runReconciliation')}
                            >
                              Retry
                            </Button>
                          )}
                          {recon.discrepancy && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              icon={AlertTriangle}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => openModal('investigateDiscrepancy', { record: recon })}
                            >
                              Investigate
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={MoreHorizontal}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <span className="sr-only">More options</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationTab;