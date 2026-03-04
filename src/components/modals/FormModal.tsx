import React from 'react';
import { BaseModal } from './BaseModal';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    children: React.ReactNode;
    submitText?: string;
    cancelText?: string;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    children,
    submitText = 'Save',
    cancelText = 'Cancel',
    loading = false,
    size = 'md',
    disabled = false
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title={title} size={size}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    {children}
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="submit"
                        disabled={loading || disabled}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {submitText}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};
