const express = require('express');
const router = express.Router();
const { generateInvoicePdf } = require('../services/invoiceService');

// @desc    Test Invoice PDF Generation
// @route   GET /api/test/invoice-pdf
// @access  Public (for testing)
router.get('/invoice-pdf', async (req, res) => {
  try {
    const dummyInvoiceData = {
      invoiceNo: "SI/PI/531/24-25",
      date: "13-Jan-25",
      supplier: {
        name: "SUMAN INTERNATIONAL",
        address: "SAGAR ESTATE, 2, NARENDRA CH. DUTTA SARANI, 12T FLOOR, OFFICE NO:- 6, UNIT NO:- 9, NEAR DUNCAN HOUSE, KOLKATA- 700001",
        gstin: "19ACQPJ5066M1ZU",
        state: "West Bengal",
        stateCode: "19",
        pan: "ACQPJ5066M"
      },
      buyer: {
        name: "SHIVAM HOSIERY",
        address: "PLOT: 751/10, VIVEKANANDA NAGAR, PHASE-1, MOPKA, BILASPUR, CHHATISGARH-495006",
        gstin: "22CMIPP6138G1Z0",
        state: "Chhattisgarh",
        stateCode: "22"
      },
      items: [
        { 
          description: "PVC REFLECTIVE TAPE", 
          hsn: "39219099", 
          quantity: "4,480.000 MTR", 
          rate: "3.40", 
          unit: "MTR", 
          amount: "15232.00",
          subDetails: ["50MMX100MTR=45ROLLS", "1CTN X 30ROLLS EACH CTN", "1CTN X 14ROLLS"]
        },
        { 
          description: "HIGH REFLECTIVE 25 WASH POLYESTER TAPE 50MMX200MTR", 
          hsn: "59070099", 
          quantity: "2,000.000 MTR", 
          rate: "6.10", 
          unit: "MTR", 
          amount: "12200.00",
          subDetails: ["1CTN"]
        }
      ],
      taxDetails: {
        breakdown: [
          { hsn: "39219099", taxableValue: "15232.00", rate: "18%", amount: "2741.76" },
          { hsn: "59070099", taxableValue: "12200.00", rate: "12%", amount: "1464.00" }
        ]
      },
      bankDetails: {
        name: "HDFC - O/D A/C",
        accNo: "50200038864999",
        ifsc: "P/34, INDIA EXCHANGE PLACE, KOLKATA-1 & HDFC0001242"
      },
      totalQty: "6,480.000 MTR",
      amountInWords: "Twenty Seven Thousand Four Hundred Thirty Two Only",
      qrUrl: "https://shivamhosiery.com/verify/SI-PI-531"
    };

    const pdfBuffer = await generateInvoicePdf(dummyInvoiceData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=test-invoice.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
