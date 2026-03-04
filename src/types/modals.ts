export interface ExportDataModalData {
  type: 'payments' | 'analytics';
}

// Union type of all modal data
export type ModalDataMap = {
  exportData: ExportDataModalData;
};
