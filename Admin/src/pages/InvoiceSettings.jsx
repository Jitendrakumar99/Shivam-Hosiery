import { useState, useEffect } from 'react';
import InvoiceTemplate from '../components/Invoice/InvoiceTemplate';

// Mock data for preview
const mockOrder = {
    _id: 'ORDER#12345678',
    createdAt: new Date().toISOString(),
    totalAmount: 2500,
    shippingCost: 150,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    status: 'delivered',
    shippingAddress: {
        name: 'Jitendra Kumar',
        address: '123 Main Street, Industrial Area',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        phone: '9876543210'
    },
    items: [
        { product: { title: 'Premium Cotton Tee', pricing: { price: 500 } }, price: 500, quantity: 2, sku: 'TSH-001' },
        { product: { title: 'Denim Jacket', pricing: { price: 1500 } }, price: 1500, quantity: 1, sku: 'JKT-005' },
    ]
};

const TemplatePreview = ({ templateId }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white group">
            <div
                className="absolute top-0 left-0 origin-top-left transition-transform duration-500 group-hover:scale-[0.26]"
                style={{
                    width: '800px',
                    transform: 'scale(0.24)',
                    pointerEvents: 'none',
                    backgroundColor: 'white'
                }}
            >
                <InvoiceTemplate order={mockOrder} templateId={templateId} isPreview={true} />
            </div>
        </div>
    );
};

const templates = [
    {
        id: 'standard',
        name: 'Standard Template',
        description: 'A professional, corporate-style invoice with clear sections.',
    },
    {
        id: 'minimalist',
        name: 'Minimalist Template',
        description: 'Clean and modern design with essential information only.',
    },
    {
        id: 'premium',
        name: 'Premium Design',
        description: 'Vibrant layout with brand colors and enhanced typography.',
    },
    {
        id: 'compact',
        name: 'Compact Format',
        description: 'Optimized for thermal printers or smaller paper sizes.',
    }
];

const InvoiceSettings = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('standard');
    const [previewingTemplate, setPreviewingTemplate] = useState(null);

    useEffect(() => {
        const savedTemplate = localStorage.getItem('invoiceTemplate');
        if (savedTemplate) {
            setSelectedTemplate(savedTemplate);
        }
    }, []);

    const handleSelectTemplate = (templateId) => {
        setSelectedTemplate(templateId);
        localStorage.setItem('invoiceTemplate', templateId);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Settings</h1>
                <p className="text-gray-600">Choose your preferred invoice template. Click the "View" button to see a full-screen preview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`group/card relative rounded-xl border-2 transition-all bg-white shadow-sm flex flex-col ${selectedTemplate === template.id
                            ? 'border-indigo-600 ring-4 ring-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="aspect-[3/4] bg-white flex items-center justify-center border-b border-gray-100 overflow-hidden relative cursor-pointer" onClick={() => handleSelectTemplate(template.id)}>
                            <TemplatePreview templateId={template.id} />
                            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors z-10"></div>
                        </div>

                        {/* View Full Button */}
                        <button
                            onClick={() => setPreviewingTemplate(template)}
                            className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur shadow-md p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:scale-110 transition-all opacity-0 group-hover/card:opacity-100"
                            title="View Full Preview"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>

                        <div className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-gray-800 text-sm">{template.name}</h3>
                                {selectedTemplate === template.id && (
                                    <span className="bg-indigo-600 text-white p-1 rounded-full">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                        </div>

                        <button
                            onClick={() => handleSelectTemplate(template.id)}
                            className={`p-3 text-center text-sm font-semibold border-t transition-colors ${selectedTemplate === template.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {selectedTemplate === template.id ? 'Active Template' : 'Select Template'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Full Screen Preview Modal */}
            {previewingTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => setPreviewingTemplate(null)}
                    ></div>

                    <div className="relative bg-white w-full max-w-5xl h-full rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{previewingTemplate.name}</h2>
                                <p className="text-xs text-gray-500">Full-scale print preview with sample data</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        handleSelectTemplate(previewingTemplate.id);
                                        setPreviewingTemplate(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedTemplate === previewingTemplate.id
                                        ? 'bg-indigo-100 text-indigo-700 cursor-default'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    {selectedTemplate === previewingTemplate.id ? 'Currently Active' : 'Set as Active'}
                                </button>
                                <button
                                    onClick={() => setPreviewingTemplate(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Scrollable Preview */}
                        <div className="flex-1 overflow-auto bg-gray-100 p-8 custom-scrollbar">
                            <div className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden ring-1 ring-gray-200">
                                <InvoiceTemplate order={mockOrder} templateId={previewingTemplate.id} isPreview={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-12 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Print Instructions
                </h2>
                <div className="space-y-4 text-gray-600 text-sm">
                    <p className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">1</span>
                        Select a template above. It is automatically saved to your browser.
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">2</span>
                        Navigate to the <b>Orders</b> page and click the <b>"Invoice"</b> button on any order.
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">3</span>
                        The browser print dialog will open. Select <b>"Save as PDF"</b> or your printer.
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">4</span>
                        Ensure <b>"Background Graphics"</b> is checked in print settings for colors and designs to appear correctly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSettings;
