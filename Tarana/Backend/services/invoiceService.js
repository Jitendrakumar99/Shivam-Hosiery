const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs/promises');
const path = require('path');

// Utility to wrap text
function wrapText(text, font, size, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, size);
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  function convertChunk(n) {
    let s = '';
    if (n >= 100) {
      s += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      s += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      s += ones[n] + ' ';
    }
    return s;
  }

  let words = '';
  let chunkCount = 0;

  // Handle Lakh/Crore system for India
  let n = Math.floor(num);
  
  // Last 3 digits (Hundreds)
  let hundreds = n % 1000;
  if (hundreds > 0) {
    words = convertChunk(hundreds) + words;
  }
  n = Math.floor(n / 1000);

  // Next digits in pairs (Thousands, Lakhs, Crores)
  while (n > 0) {
    chunkCount++;
    let chunk = n % 100;
    if (chunk > 0) {
      words = convertChunk(chunk) + scales[chunkCount] + ' ' + words;
    }
    n = Math.floor(n / 100);
  }

  const paise = Math.round((num % 1) * 100);
  let paiseWords = '';
  if (paise > 0) {
    paiseWords = ' and ' + convertChunk(paise) + 'paise';
  }

  return words.trim() + paiseWords + ' Only';
}

exports.generateInvoicePdf = async (invoiceData) => {
  const {
    invoiceNo,
    date,
    supplier = {},
    buyer = {},
    items = [],
    bankDetails = {},
    taxDetails = {}
  } = invoiceData;

  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 Size
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const drawText = (text, x, y, size = 10, isBold = false) => {
    page.drawText(String(text), {
      x,
      y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
  };

  const drawRect = (x, y, w, h) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
  };

  const drawLine = (x1, y1, x2, y2) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
  };

  // Main Border
  drawRect(20, 20, width - 40, height - 40);

  // Title
  const title = "PROFORMA INVOICE";
  const titleWidth = boldFont.widthOfTextAtSize(title, 12);
  drawText(title, (width - titleWidth) / 2, height - 35, 12, true);

  // Top Section (Supplier and Invoice Info)
  drawLine(20, height - 40, width - 20, height - 40);
  
  // Supplier Info (Left)
  let y = height - 55;
  drawText(supplier.name || 'SUMAN INTERNATIONAL', 25, y, 11, true);
  y -= 12;
  const supplierAddress = wrapText(supplier.address || '', font, 8, 250);
  supplierAddress.forEach(line => {
    drawText(line, 25, y, 8);
    y -= 10;
  });
  drawText(`GSTIN/UIN: ${supplier.gstin || ''}`, 25, y, 8, true);
  y -= 10;
  drawText(`State Name: ${supplier.state || ''}, Code: ${supplier.stateCode || ''}`, 25, y, 8);

  // Invoice Details (Right)
  drawLine(width / 2, height - 40, width / 2, height - 300); // Vertical middle line for top section
  
  let ry = height - 55;
  drawText('Invoice No.', width / 2 + 5, ry, 8);
  drawText('Dated', width - 100, ry, 8);
  ry -= 12;
  drawText(invoiceNo || '', width / 2 + 5, ry, 9, true);
  drawText(date || '', width - 100, ry, 9, true);
  
  drawLine(width / 2, ry - 5, width - 20, ry - 5);
  ry -= 15;
  drawText('Delivery Note', width / 2 + 5, ry, 8);
  drawText('Mode/Terms of Payment', width - 150, ry, 8);
  ry -= 12;
  drawText('100% AGAINST PROFORMA INVOICE', width - 150, ry, 7, true);

  drawLine(width / 2, ry - 5, width - 20, ry - 5);
  ry -= 15;
  drawText('Reference No. & Date.', width / 2 + 5, ry, 8);
  drawText('Other References', width - 150, ry, 8);

  // Consignee Section
  drawLine(20, height - 160, width / 2, height - 160);
  let cy = height - 170;
  drawText('Consignee (Ship to)', 25, cy, 8, true);
  cy -= 12;
  drawText(buyer.name || 'SHIVAM HOSIERY', 25, cy, 10, true);
  cy -= 12;
  const buyerAddress = wrapText(buyer.address || '', font, 8, 250);
  buyerAddress.forEach(line => {
    drawText(line, 25, cy, 8);
    cy -= 10;
  });
  drawText(`GSTIN/UIN: ${buyer.gstin || ''}`, 25, cy, 8, true);
  cy -= 10;
  drawText(`State Name: ${buyer.state || ''}, Code: ${buyer.stateCode || ''}`, 25, cy, 8);

  // Buyer (Bill to) Section
  drawLine(20, cy - 5, width / 2, cy - 5);
  cy -= 15;
  drawText('Buyer (Bill to)', 25, cy, 8, true);
  cy -= 12;
  drawText(buyer.name || 'SHIVAM HOSIERY', 25, cy, 10, true);
  cy -= 12;
  buyerAddress.forEach(line => {
    drawText(line, 25, cy, 8);
    cy -= 10;
  });

  // Table Headers
  const tableY = height - 300;
  const colX = [20, 45, 285, 345, 405, 465, 510, width - 20]; // Precise column X positions
  
  drawLine(20, tableY, width - 20, tableY);
  drawText('Sl', colX[0] + 5, tableY - 8, 7, true);
  drawText('No.', colX[0] + 5, tableY - 16, 7, true);
  
  drawText('Description of', colX[1] + 70, tableY - 8, 7, true);
  drawText('Goods and Services', colX[1] + 60, tableY - 16, 7, true);
  
  drawText('HSN/SAC', colX[2] + 5, tableY - 12, 7, true);
  drawText('Quantity', colX[3] + 5, tableY - 12, 7, true);
  drawText('Rate', colX[4] + 15, tableY - 12, 7, true);
  drawText('per', colX[5] + 10, tableY - 12, 7, true);
  drawText('Amount', colX[6] + 15, tableY - 12, 7, true);
  drawLine(20, tableY - 20, width - 20, tableY - 20);

  // Table Content
  let ty = tableY - 32;
  let totalAmount = 0;
  let totalQtyNum = 0;

  items.forEach((item, index) => {
    const startTy = ty;
    drawText(index + 1, colX[0] + 5, ty, 8);
    
    // Wrap description to stay within column
    const descLines = wrapText(item.description || '', font, 8, colX[2] - colX[1] - 10);
    descLines.forEach(line => {
      drawText(line, colX[1] + 5, ty, 8, true);
      ty -= 10;
    });

    // Sub details
    if (item.subDetails) {
      item.subDetails.forEach(detail => {
        const subLines = wrapText(detail, font, 7, colX[2] - colX[1] - 15);
        subLines.forEach(sub => {
          drawText(sub, colX[1] + 10, ty, 7, false);
          ty -= 9;
        });
      });
    }

    // Draw other columns at the same Y as the first line of description
    drawText(item.hsn || '', colX[2] + 5, startTy, 8);
    drawText(item.quantity || '', colX[3] + 5, startTy, 8, true);
    drawText(item.rate || '', colX[4] + 5, startTy, 8, true);
    drawText(item.unit || '', colX[5] + 5, startTy, 8);
    drawText(item.amount || '', colX[6] + 5, startTy, 8, true);

    totalAmount += parseFloat(item.amount || 0);
    ty -= 5; // Gap between items
  });

  // Vertical Table Lines (extending down to the total section)
  const bottomY = 220;
  for (let i = 1; i < colX.length - 1; i++) {
    drawLine(colX[i], tableY, colX[i], bottomY);
  }

  // Totals Section
  drawLine(20, bottomY, width - 20, bottomY);
  drawText('Total', colX[1] + 180, bottomY - 12, 9, true);
  drawText(invoiceData.totalQty || '', colX[3] + 2, bottomY - 12, 8, true);
  drawText(`Rs. ${totalAmount.toFixed(2)}`, colX[6] + 2, bottomY - 12, 9, true);

  // Amount in words
  drawLine(20, bottomY - 18, width - 20, bottomY - 18);
  drawText('Amount Chargeable (in words)', 25, bottomY - 28, 7);
  const finalAmountInWords = invoiceData.amountInWords || numberToWords(totalAmount);
  drawText(`Rupees ${finalAmountInWords}`, 25, bottomY - 40, 9, true);

  // Tax Table Section
  const taxY = bottomY - 60;
  const taxColX = [20, 285, 415, 465, 525, width - 20];
  
  drawLine(20, taxY, width - 20, taxY);
  drawText('HSN/SAC', taxColX[0] + 5, taxY - 10, 7, true);
  drawText('Taxable', taxColX[1] + 5, taxY - 8, 6, true);
  drawText('Value', taxColX[1] + 10, taxY - 14, 6, true);
  
  drawText('IGST', (taxColX[2] + taxColX[4]) / 2 - 10, taxY - 8, 6, true);
  drawLine(taxColX[2], taxY - 10, taxColX[4], taxY - 10);
  drawText('Rate', taxColX[2] + 5, taxY - 16, 6, true);
  drawText('Amount', taxColX[3] + 5, taxY - 16, 6, true);
  
  drawText('Total', taxColX[4] + 10, taxY - 8, 6, true);
  drawText('Tax Amount', taxColX[4] + 5, taxY - 14, 6, true);
  drawLine(20, taxY - 20, width - 20, taxY - 20);

  let tyTax = taxY - 30;
  let totalTaxVal = 0;
  let totalTaxAmt = 0;
  (taxDetails.breakdown || []).forEach(row => {
    drawText(row.hsn || '', taxColX[0] + 5, tyTax, 7);
    drawText(row.taxableValue || '', taxColX[1] + 5, tyTax, 7);
    drawText(row.rate || '', taxColX[2] + 5, tyTax, 7);
    drawText(row.amount || '', taxColX[3] + 5, tyTax, 7);
    drawText(row.amount || '', taxColX[4] + 5, tyTax, 7);
    totalTaxVal += parseFloat(row.taxableValue || 0);
    totalTaxAmt += parseFloat(row.amount || 0);
    tyTax -= 10;
  });

  // Vertical lines for tax table
  for (let i = 1; i < taxColX.length - 1; i++) {
    drawLine(taxColX[i], taxY, taxColX[i], tyTax - 5);
  }
  drawLine(taxColX[3], taxY - 10, taxColX[3], tyTax - 5); // IGST split line

  drawLine(20, tyTax - 5, width - 20, tyTax - 5);
  drawText('Total', taxColX[0] + 5, tyTax - 15, 8, true);
  drawText(totalTaxVal.toFixed(2), taxColX[1] + 5, tyTax - 15, 8, true);
  drawText(totalTaxAmt.toFixed(2), taxColX[3] + 5, tyTax - 15, 8, true);
  drawText(totalTaxAmt.toFixed(2), taxColX[4] + 5, tyTax - 15, 8, true);

  // Tax Amount (in words)
  const taxInWordsY = tyTax - 15;
  drawText('Tax Amount (in words) : ', 25, taxInWordsY, 7);
  const finalTaxInWords = invoiceData.taxInWords || numberToWords(totalTaxAmt);
  drawText(finalTaxInWords, 105, taxInWordsY, 7, true);
  
  drawLine(20, taxInWordsY - 8, width - 20, taxInWordsY - 8);

  // Footer Section (Reorganized to avoid clustering)
  const footerTopY = taxInWordsY - 20;
  const footerMidX = 260; // Adjusted mid point
  
  // Vertical line for footer sections
  drawLine(footerMidX, footerTopY, footerMidX, 40);

  // Left Section: PAN, Declaration, QR
  let ly = footerTopY - 12;
  drawText('Company\'s PAN', 25, ly, 8);
  drawText(': ' + (supplier.pan || ''), 95, ly, 8, true);
  
  ly -= 15;
  drawText('Declaration', 25, ly, 7, false);
  drawLine(25, ly - 2, 62, ly - 2); // Underline
  
  ly -= 12;
  const declaration = "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.";
  const declLines = wrapText(declaration, font, 7, footerMidX - 40);
  declLines.forEach((line, i) => {
    drawText(line, 25, ly - (i * 9), 7);
  });

  // QR Code - Smaller and positioned safely
  try {
    const qrUrl = invoiceData.qrUrl || `https://shivamhosiery.com/verify/${invoiceNo}`;
    const qrPng = await QRCode.toBuffer(qrUrl, { type: 'png', width: 45, margin: 1 });
    const qrImage = await doc.embedPng(qrPng);
    page.drawImage(qrImage, { x: footerMidX - 55, y: 45, width: 45, height: 45 });
  } catch (err) {}

  // Right Section: Bank Details and Signature
  ry = footerTopY - 12;
  drawText('Company\'s Bank Details', footerMidX + 10, ry, 8, true);
  
  ry -= 12;
  drawText('Bank Name', footerMidX + 10, ry, 7);
  drawText(': ' + (bankDetails.name || ''), footerMidX + 85, ry, 7, true);
  
  ry -= 10;
  drawText('A/c No.', footerMidX + 10, ry, 7);
  drawText(': ' + (bankDetails.accNo || ''), footerMidX + 85, ry, 7, true);
  
  ry -= 10;
  drawText('Branch & IFS Code', footerMidX + 10, ry, 7);
  const branchLines = wrapText(': ' + (bankDetails.ifsc || ''), font, 7, width - footerMidX - 100);
  branchLines.forEach((line, i) => {
    drawText(line, footerMidX + 85, ry - (i * 9), 7, true);
  });

  // Signature area - Moved down to avoid bank details
  const signY = 70;
  drawLine(footerMidX, signY + 12, width - 20, signY + 12);
  drawText('for ' + (supplier.name || 'SUMAN INTERNATIONAL'), footerMidX + 40, signY, 8, true);
  drawText('Authorised Signatory', width - 110, 48, 8);

  // Footer Note
  const footerNote = "This is a Computer Generated Invoice";
  const noteWidth = font.widthOfTextAtSize(footerNote, 7);
  drawText(footerNote, (width - noteWidth) / 2, 15, 7);

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
};
