import React, { useState } from 'react';
import { Download, Calendar, FileText, Table } from 'lucide-react';
import { FormModal } from './FormModal';
import { Select } from '../common/Select';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => void;
  loading?: boolean;
}

interface ExportConfig {
  format: 'csv' | 'pdf';
  dateRange: string;
  dataType: string;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  onExport,
  loading = false
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    dateRange: '30d',
    dataType: 'transactions'
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV - Spreadsheet format' },
    { value: 'pdf', label: 'PDF - Report format' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const dataTypeOptions = [
    { value: 'transactions', label: 'Transaction Data' },
    { value: 'providers', label: 'Provider Performance' },
    { value: 'failures', label: 'Failure Analysis' },
    { value: 'summary', label: 'Executive Summary' }
  ];

  const handleExport = () => {
    onExport(config);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleExport}
      title="Export Analytics Data"
      submitText="Export Data"
      loading={loading}
      size="md"
    >
      <div className="space-y-5">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Download className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">Export Configuration</p>
              <p className="text-xs text-blue-700 mt-1">
                Choose your preferred format and data range for the export
              </p>
            </div>
          </div>
        </div>

        <Select
          label="Export Format"
          value={config.format}
          onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as 'csv' | 'pdf' }))}
          options={formatOptions}
          icon={config.format === 'csv' ? Table : FileText}
        />

        <Select
          label="Date Range"
          value={config.dateRange}
          onChange={(e) => setConfig(prev => ({ ...prev, dateRange: e.target.value }))}
          options={dateRangeOptions}
          icon={Calendar}
        />

        <Select
          label="Data Type"
          value={config.dataType}
          onChange={(e) => setConfig(prev => ({ ...prev, dataType: e.target.value }))}
          options={dataTypeOptions}
        />

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Export Preview</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Format: {config.format.toUpperCase()}</p>
            <p>• Range: {dateRangeOptions.find(opt => opt.value === config.dateRange)?.label}</p>
            <p>• Data: {dataTypeOptions.find(opt => opt.value === config.dataType)?.label}</p>
          </div>
        </div>
      </div>
    </FormModal>
  );
};