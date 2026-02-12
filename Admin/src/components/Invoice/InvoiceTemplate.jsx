import React from 'react';

const InvoiceTemplate = ({ order, templateId = 'standard', isPreview = false }) => {
    const items = order.items || [];
    const totalAmount = Number(order.totalAmount ?? order.total ?? 0);
    const shippingCost = Number(order.shippingCost ?? 0);
    const grandTotal = totalAmount + shippingCost;
    const date = new Date(isPreview ? new Date() : order.createdAt).toLocaleDateString();

    const renderStandard = () => (
        <div className={`bg-white text-gray-800 font-sans ${isPreview ? 'p-4' : 'p-8'}`}>
            <div className="flex justify-between items-start border-b-2 border-gray-200 pb-6 mb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1">INVOICE</h1>
                    <p className="text-gray-500 text-xs font-medium">#{order._id?.toString().slice(-8).toUpperCase()}</p>
                    <p className="text-gray-500 text-xs">Date: {date}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-black text-indigo-700">SHIVAM HOSIERY</h2>
                    <p className="text-gray-400 text-[8px] tracking-widest uppercase">Premium Safety Garments</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Recipient</h3>
                    <p className="font-bold text-sm text-gray-900">{order.shippingAddress?.name}</p>
                    <div className="text-gray-600 space-y-0.5 text-[11px]">
                        <p>{order.shippingAddress?.address}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="pt-1 text-gray-400">Ph: {order.shippingAddress?.phone}</p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end text-[11px]">
                    <h3 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 w-full text-right">Transaction Details</h3>
                    <p className="text-gray-600"><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                    <p className="text-gray-600"><span className="font-medium">Status:</span> <span className="text-green-600 font-bold uppercase text-[9px]">{order.paymentStatus || 'Verified'}</span></p>
                    {order.trackingNumber && <p className="mt-2 text-indigo-600 font-mono text-[9px] font-bold">TRK: {order.trackingNumber}</p>}
                </div>
            </div>

            <table className="w-full mb-8 font-sans border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-left border-y border-gray-100">
                        <th className="px-3 py-2 font-black text-[9px] uppercase text-gray-400">Description</th>
                        <th className="px-3 py-2 font-black text-[9px] uppercase text-gray-400 text-center">SKU</th>
                        <th className="px-3 py-2 font-black text-[9px] uppercase text-gray-400 text-right">Rate</th>
                        <th className="px-3 py-2 font-black text-[9px] uppercase text-gray-400 text-center">Qty</th>
                        <th className="px-3 py-2 font-black text-[9px] uppercase text-gray-400 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-3 py-3">
                                <p className="font-bold text-gray-800 text-xs">{item.product?.title || item.product?.name || 'Item'}</p>
                            </td>
                            <td className="px-3 py-3 text-center text-[10px] font-mono font-bold text-indigo-700">{(item.sku || item.product?.sku) || '---'}</td>
                            <td className="px-3 py-3 text-right text-xs text-gray-500">₹{Number(item.price).toLocaleString()}</td>
                            <td className="px-3 py-3 text-center text-xs">{item.quantity}</td>
                            <td className="px-3 py-3 text-right font-black text-gray-900 text-xs">₹{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end pr-2 font-sans">
                <div className="w-48 space-y-2">
                    <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-800">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400">
                        <span>Delivery</span>
                        <span className="font-bold text-gray-800">₹{shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center text-indigo-700">
                        <span className="font-black text-[9px] uppercase tracking-tighter">Amount Due</span>
                        <span className="text-xl font-black">₹{grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMinimalist = () => (
        <div className={`bg-white text-slate-800 font-light ${isPreview ? 'p-6' : 'p-16'}`}>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <div className="text-4xl tracking-tighter font-extralight text-slate-200 mb-2">INVOICE</div>
                    <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{date}</div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-light text-slate-900 uppercase tracking-tighter">SHIVAM HOSIERY</div>
                    <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold tracking-widest">Order Ref: {order._id?.toString().slice(-8).toUpperCase()}</p>
                </div>
            </div>

            <div className="mb-16">
                <div className="text-[9px] font-bold text-slate-200 uppercase tracking-[0.2em] mb-4">Billed To</div>
                <div className="text-2xl font-light text-slate-800">{order.shippingAddress?.name}</div>
                <div className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </div>
            </div>

            <div className="space-y-6 mb-16">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-6 last:border-0">
                        <div className="flex-1">
                            <div className="text-sm text-slate-800 mb-0.5">{item.product?.title || item.product?.name}</div>
                            <div className="text-[9px] text-slate-500 tracking-[0.1em] font-bold uppercase">SKU: {(item.sku || item.product?.sku) || 'N/A'}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-900 font-normal">₹{item.price * item.quantity}</div>
                            <div className="text-[9px] text-slate-400">{item.quantity} x ₹{item.price}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-end pt-8 border-t border-slate-50">
                <div className="w-48 space-y-3">
                    <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Items</span>
                        <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Shipping</span>
                        <span>₹{shippingCost}</span>
                    </div>
                    <div className="flex justify-between text-2xl text-slate-950 font-light mt-4 pt-4 border-t border-slate-100">
                        <span>Total</span>
                        <span>₹{grandTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPremium = () => (
        <div className={`bg-white flex flex-col h-full`}>
            <div className="bg-[#1a1a2e] text-white p-10 flex justify-between items-center">
                <div>
                    <div className="text-[10px] font-bold tracking-[0.4em] opacity-30 mb-1 uppercase text-blue-300">Transaction Document</div>
                    <div className="text-4xl font-black italic tracking-tighter">SHIVAM</div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-black bg-white/5 border border-white/10 px-4 py-2 rounded-xl">#{order._id?.toString().slice(-8).toUpperCase()}</div>
                    <div className="opacity-30 text-[9px] mt-2 font-bold uppercase tracking-[0.2em]">{date}</div>
                </div>
            </div>

            <div className={`flex-1 ${isPreview ? 'p-8' : 'p-16'}`}>
                <div className="grid grid-cols-2 gap-10 mb-12 border-b border-gray-50 pb-10">
                    <div>
                        <div className="text-indigo-500 font-black text-[9px] uppercase tracking-[0.2em] mb-4">Consignee</div>
                        <div className="text-xl font-black text-gray-900 mb-1">{order.shippingAddress?.name}</div>
                        <div className="text-gray-400 font-medium text-xs leading-relaxed max-w-[200px]">
                            {order.shippingAddress?.address}<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="text-indigo-500 font-black text-[9px] uppercase tracking-[0.2em] mb-4">Verification</div>
                        <div className="space-y-2 text-right">
                            <p className="text-xs font-bold text-gray-700">{order.paymentMethod}</p>
                            <div className="px-3 py-1 bg-green-500 text-white rounded-lg text-[9px] font-black uppercase inline-block">Order {order.paymentStatus || 'Verified'}</div>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <table className="w-full text-left font-sans border-collapse">
                        <thead>
                            <tr className="border-b border-gray-900">
                                <th className="py-3 text-[9px] font-black uppercase text-gray-900">Item Description</th>
                                <th className="py-3 text-[9px] font-black uppercase text-gray-900 text-center">Qty</th>
                                <th className="py-3 text-[9px] font-black uppercase text-gray-900 text-right">Aggregate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic font-bold">
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="py-4">
                                        <div className="font-black text-gray-900 text-sm uppercase tracking-tight">{item.product?.title || item.product?.name}</div>
                                        <div className="text-[8px] text-gray-600 font-black mt-0.5 uppercase tracking-widest">SKU: {(item.sku || item.product?.sku) || 'N/A'}</div>
                                    </td>
                                    <td className="py-4 text-center font-black text-gray-300 text-sm">{item.quantity}</td>
                                    <td className="py-4 text-right font-black text-gray-900 text-lg">₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end pt-6 font-sans">
                    <div className="w-64 bg-[#f8f9ff] p-6 rounded-2xl space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>MERCHANDISE</span>
                            <span className="text-gray-900">₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-gray-400">
                            <span>SHIPMENT</span>
                            <span className="text-gray-900">₹{shippingCost}</span>
                        </div>
                        <div className="h-px bg-gray-200"></div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-gray-900 font-black text-[9px] uppercase opacity-40">Final Amount</span>
                            <span className="text-3xl font-black text-[#1a1a2e]">₹{grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCompact = () => (
        <div className={`bg-white text-black font-mono text-[9px] w-[80mm] border border-gray-100 mx-auto ${isPreview ? 'p-4' : 'p-6'}`}>
            <div className="text-center font-bold text-base mb-0.5 leading-none">SHIVAM HOSIERY</div>
            <div className="text-center text-[7px] mb-4 uppercase opacity-50 tracking-widest">Quality Safety Apparel</div>

            <div className="border-y border-dashed border-black py-2 mb-4 space-y-1 text-[8px]">
                <div className="flex justify-between"><span>INV:</span><span className="font-bold">#{order._id?.toString().slice(-6).toUpperCase()}</span></div>
                <div className="flex justify-between"><span>DATE:</span><span>{date}</span></div>
                <div className="flex justify-between"><span>SHIP TO:</span><span className="font-bold">{order.shippingAddress?.name?.slice(0, 15).toUpperCase()}</span></div>
            </div>

            <div className="space-y-1.5 mb-6 text-[8px]">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <div>{item.quantity}X {item.product?.title?.slice(0, 18).toUpperCase()}</div>
                            <div className="text-[7px] opacity-80 font-bold">ITEM SKU: {(item.sku || item.product?.sku) || '-'}</div>
                        </div>
                        <div className="font-bold">₹{item.price * item.quantity}</div>
                    </div>
                ))}
            </div>

            <div className="border-t-2 border-black pt-2 space-y-1 text-[8px]">
                <div className="flex justify-between"><span>SUB-TOTAL</span><span>₹{totalAmount}</span></div>
                <div className="flex justify-between"><span>SHIPPING</span><span>₹{shippingCost}</span></div>
                <div className="flex justify-between font-bold text-xs mt-1 border-t border-black pt-1">
                    <span>TOTAL</span>
                    <span>₹{grandTotal}</span>
                </div>
                <div className="text-center text-[7px] mt-2 pt-2 border-t border-dashed border-gray-200">
                    PAID VIA: {order.paymentMethod?.toUpperCase()}
                </div>
            </div>

            <div className="mt-6 text-center text-[7px] opacity-40">
                --- THANK YOU ---<br />
                AUTHENTIC SHIVAM PRODUCT
            </div>
        </div>
    );

    return (
        <div id={`invoice-print-${order._id || 'preview'}`} className="invoice-print-container">
            {!isPreview && (
                <style dangerouslySetInnerHTML={{
                    __html: `
          @media print {
            /* 1. Hide the entire application body but leave ancestors visible */
            body > * {
              visibility: hidden !important;
            }
            
            /* 2. Explicitly show ONLY the invoice container we flagged */
            .invoice-print-container.printing-now {
              visibility: visible !important;
              display: block !important;
              position: fixed !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              height: auto !important;
              background: white !important;
              z-index: 9999999 !important;
            }

            /* 3. Ensure all children inside the invoice are also visible */
            .invoice-print-container.printing-now * {
              visibility: visible !important;
            }

            /* 4. Restore layout-critical displays for visible elements */
            .invoice-print-container.printing-now .flex { display: flex !important; }
            .invoice-print-container.printing-now .grid { display: grid !important; }
            .invoice-print-container.printing-now table { display: table !important; }
            
            /* 5. Force body to not take up any extra scroll space */
            html, body {
              height: 100% !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        ` }} />
            )}

            {templateId === 'standard' && renderStandard()}
            {templateId === 'minimalist' && renderMinimalist()}
            {templateId === 'premium' && renderPremium()}
            {templateId === 'compact' && renderCompact()}
        </div>
    );
};

export default InvoiceTemplate;
