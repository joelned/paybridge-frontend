import React from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '../common/Button';

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
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || disabled}
                        variant="primary"
                        size="sm"
                        loading={loading}
                    >
                        {submitText}
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
};
