import React from 'react';
import { Button } from './Button';
import { Download, FileText } from 'lucide-react';
import { UserProgress, Theme } from '../types';

interface PDFExportProps {
    user: UserProgress;
    theme: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({ user, theme }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-brand-secondary/20 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 no-print card-padding rounded-surface soft-hover transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                    <FileText className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-brand-text">Exportar Memórias do Mês</h3>
                    <p className="text-sm text-gray-500">Salve o tema "{theme}" em PDF para o futuro.</p>
                </div>
            </div>
            <Button variant="secondary" onClick={handlePrint} className="whitespace-nowrap">
                <Download className="w-4 h-4" />
                Baixar PDF
            </Button>
        </div>
    );
};
