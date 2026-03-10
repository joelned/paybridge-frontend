import React, { useState } from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import { useToast } from '../../contexts/ToastContext';
import { analyticsService, type AnalyticsFilters } from '../../services/analyticsService';
import { merchantService } from '../../services/merchantService';
import { getErrorMessage } from '../../utils/errorHandler';
import { ExportDataModal, type ExportConfig } from './ExportDataModal';

interface Props {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<Props> = ({ children }) => {
  const { activeModal, closeModal } = useModalContext();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const buildDateFilters = (dateRange: string): AnalyticsFilters => {
    const daysByRange: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };

    const days = daysByRange[dateRange] ?? 30;
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);
    return {
      dateFrom: formatDate(dateFrom),
      dateTo: formatDate(dateTo),
    };
  };

  const triggerDownload = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1500);
  };

  const handleExport = async (config: ExportConfig) => {
    if (!activeModal || activeModal.id !== 'exportData') {
      return;
    }

    setIsExporting(true);

    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      const selectedType = activeModal.data?.type ?? 'analytics';
      let blob: Blob;
      let fileName: string;

      if (selectedType === 'analytics') {
        const analyticsTypeMap: Record<string, 'payments' | 'revenue' | 'customers'> = {
          transactions: 'payments',
          providers: 'payments',
          failures: 'payments',
          summary: 'revenue',
        };

        const analyticsType = analyticsTypeMap[config.dataType] ?? 'payments';
        const filters = buildDateFilters(config.dateRange);

        blob = await analyticsService.exportAnalyticsData(analyticsType, filters, 'CSV');
        fileName = `paybridge-analytics-${analyticsType}-${dateStamp}.csv`;

        if (config.format === 'pdf') {
          showToast('PDF export is not available yet. Downloaded CSV instead.', 'info');
        }
      } else {
        const merchantFormat = config.format === 'csv' ? 'CSV' : 'JSON';
        blob = await merchantService.exportMerchantData(merchantFormat);
        fileName = `paybridge-payments-${dateStamp}.${merchantFormat.toLowerCase()}`;

        if (config.format === 'pdf') {
          showToast('PDF export is not available yet. Downloaded JSON instead.', 'info');
        }
      }

      triggerDownload(blob, fileName);
      activeModal.callbacks?.onSuccess?.({ fileName });
      showToast('Export completed. Your download should start automatically.', 'success');
      closeModal();
    } catch (error) {
      activeModal.callbacks?.onError?.(error);
      showToast(getErrorMessage(error), 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {children}

      {/* Render active modal based on context state */}
      {activeModal?.isOpen && (
        <>
          {activeModal.id === 'exportData' && (
            <ExportDataModal
              isOpen={true}
              onClose={closeModal}
              onExport={handleExport}
              loading={isExporting}
            />
          )}
        </>
      )}
    </>
  );
};
