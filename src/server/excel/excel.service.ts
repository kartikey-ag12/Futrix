import ExcelJS from "exceljs";

export interface InvoiceData {
  contactName: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  status?: string;
}

export interface XeroInvoiceData {
  contact?: { name?: string };
  date?: string;
  dueDate?: string;
  invoiceNumber?: string;
  reference?: string;
  currencyCode?: string;
  lineAmountTypes?: string;
  subTotal?: number;
  lineItems?: Array<{
    itemCode?: string;
    description?: string;
    quantity?: number;
    unitAmount?: number;
    discountRate?: number;
    accountCode?: string;
    lineAmount?: number;
  }>;
}

export class ExcelService {
  /**
   * Generates an Excel file for a single invoice.
   */
  static async generateInvoiceExcel(invoice: InvoiceData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoice");

    // Add Company Header
    sheet.mergeCells("A1:D2");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "INVOICE";
    titleCell.font = { size: 20, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Add Invoice Details
    sheet.getCell("A4").value = "Billed To:";
    sheet.getCell("B4").value = invoice.contactName;
    sheet.getCell("B4").font = { bold: true };

    sheet.getCell("A5").value = "Date:";
    sheet.getCell("B5").value = invoice.date;

    if (invoice.dueDate) {
      sheet.getCell("A6").value = "Due Date:";
      sheet.getCell("B6").value = invoice.dueDate;
    }

    if (invoice.status) {
      sheet.getCell("A7").value = "Status:";
      sheet.getCell("B7").value = invoice.status;
    }

    // Add Line Items Header
    sheet.getRow(9).values = ["Description", "Quantity", "Unit Price", "Total"];
    sheet.getRow(9).font = { bold: true };
    sheet.getRow(9).alignment = { horizontal: "center" };

    // Add Line Items (Simplified for now, one item per invoice data)
    sheet.getRow(10).values = [invoice.description, 1, invoice.amount, invoice.amount];

    // Add Total
    sheet.getCell("C12").value = "Total Amount:";
    sheet.getCell("C12").font = { bold: true };
    sheet.getCell("D12").value = invoice.amount;
    sheet.getCell("D12").font = { bold: true };

    // Format Columns
    sheet.columns = [
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];

    // Style borders
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    ["A9", "B9", "C9", "D9", "A10", "B10", "C10", "D10"].forEach(cellRef => {
      sheet.getCell(cellRef).border = borderStyle as Partial<ExcelJS.Borders>;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Generates an Excel report of multiple invoices.
   */
  static async generateInvoicesReport(invoices: InvoiceData[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoices Report");

    sheet.columns = [
      { header: "Contact Name", key: "contactName", width: 25 },
      { header: "Description", key: "description", width: 40 },
      { header: "Date", key: "date", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    sheet.getRow(1).font = { bold: true };

    invoices.forEach(inv => {
      sheet.addRow({
        contactName: inv.contactName,
        description: inv.description,
        date: inv.date,
        amount: inv.amount,
        status: inv.status || "DRAFT"
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Parses an uploaded Excel file to extract invoice data.
   */
  static async parseInvoicesExcel(buffer: Buffer): Promise<InvoiceData[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    const sheet = workbook.getWorksheet(1); // Get first sheet

    if (!sheet) {
      throw new Error("No worksheet found in Excel file.");
    }

    const invoices: InvoiceData[] = [];

    // Assuming first row is header
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      // Example column layout: Contact, Description, Date, Amount, Status
      const contactName = row.getCell(1).text;
      const description = row.getCell(2).text;
      const date = row.getCell(3).text;
      const amountVal = row.getCell(4).value;
      const status = row.getCell(5).text;

      if (!contactName || !amountVal) return; // Skip invalid rows

      let amount = 0;
      if (typeof amountVal === "number") amount = amountVal;
      else if (typeof amountVal === "string") amount = parseFloat(amountVal);

      invoices.push({
        contactName,
        description: description || "Imported Invoice",
        date: date || new Date().toISOString().split('T')[0],
        amount,
        status: status || "DRAFT",
      });
    });

    return invoices;
  }

  static async generateProfessionalXeroInvoice(invoice: XeroInvoiceData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoice");

    // Columns setup mimicking the Xero UI table
    // A: Padding, B: Item, C: Description, D: Qty, E: Price, F: Disc, G: Account, H: Tax rate, I: Tax amount, J: Region, K: Project, L: Amount
    sheet.columns = [
      { width: 3 },   // A
      { width: 12 },  // B: Item
      { width: 30 },  // C: Description
      { width: 10 },  // D: Qty
      { width: 12 },  // E: Price
      { width: 8 },   // F: Disc
      { width: 15 },  // G: Account
      { width: 22 },  // H: Tax rate
      { width: 12 },  // I: Tax amount
      { width: 12 },  // J: Region
      { width: 22 },  // K: Project
      { width: 15 }   // L: Amount
    ];

    // Common styles
    const labelFont = { size: 9, color: { argb: "FF4B5563" }, bold: true };
    const valueFont = { size: 10, color: { argb: "FF111827" } };
    const boxBorder: Partial<ExcelJS.Borders> = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } }
    };

    // --- Top Form Section ---
    // Row 2 Labels
    sheet.getCell("B2").value = "Contact";
    sheet.getCell("B2").font = labelFont;
    
    sheet.getCell("E2").value = "Issue date";
    sheet.getCell("E2").font = labelFont;

    sheet.getCell("G2").value = "Due date";
    sheet.getCell("G2").font = labelFont;

    sheet.getCell("I2").value = "Invoice number";
    sheet.getCell("I2").font = labelFont;

    sheet.getCell("K2").value = "Reference";
    sheet.getCell("K2").font = labelFont;

    // Row 3 Values (Merged for inputs)
    sheet.mergeCells("B3:D3");
    sheet.getCell("B3").value = invoice.contact?.name || "";
    sheet.getCell("B3").font = valueFont;
    sheet.getCell("B3").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("E3:F3");
    sheet.getCell("E3").value = invoice.date ? new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "";
    sheet.getCell("E3").font = valueFont;
    sheet.getCell("E3").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("G3:H3");
    sheet.getCell("G3").value = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "";
    sheet.getCell("G3").font = valueFont;
    sheet.getCell("G3").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("I3:J3");
    sheet.getCell("I3").value = invoice.invoiceNumber ? `# ${invoice.invoiceNumber}` : "";
    sheet.getCell("I3").font = valueFont;
    sheet.getCell("I3").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("K3:L3");
    sheet.getCell("K3").value = invoice.reference || "";
    sheet.getCell("K3").font = valueFont;
    sheet.getCell("K3").border = boxBorder as Partial<ExcelJS.Borders>;

    // Row 5 Labels
    sheet.getCell("B5").value = "Branding theme";
    sheet.getCell("B5").font = labelFont;

    sheet.getCell("E5").value = "Online payments";
    sheet.getCell("E5").font = labelFont;

    sheet.getCell("G5").value = "Currency";
    sheet.getCell("G5").font = labelFont;

    sheet.getCell("I5").value = "Amounts are";
    sheet.getCell("I5").font = labelFont;

    // Row 6 Values
    sheet.mergeCells("B6:D6");
    sheet.getCell("B6").value = "Standard";
    sheet.getCell("B6").font = valueFont;
    sheet.getCell("B6").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("E6:F6");
    sheet.getCell("E6").value = "PayPal";
    sheet.getCell("E6").font = valueFont;
    sheet.getCell("E6").border = boxBorder as Partial<ExcelJS.Borders>;
    sheet.getCell("E6").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };

    sheet.mergeCells("G6:H6");
    sheet.getCell("G6").value = invoice.currencyCode === 'USD' ? 'United States Dollar' : (invoice.currencyCode || 'USD');
    sheet.getCell("G6").font = valueFont;
    sheet.getCell("G6").border = boxBorder as Partial<ExcelJS.Borders>;

    sheet.mergeCells("I6:J6");
    sheet.getCell("I6").value = invoice.lineAmountTypes === 'Exclusive' ? 'Tax exclusive' : (invoice.lineAmountTypes === 'Inclusive' ? 'Tax inclusive' : 'No tax');
    sheet.getCell("I6").font = valueFont;
    sheet.getCell("I6").border = boxBorder as Partial<ExcelJS.Borders>;

    // --- Line Items Table ---
    let currentRow = 8;
    const headerRow = sheet.getRow(currentRow);
    headerRow.values = ["", "Item", "Description", "Qty.", "Price", "Disc.", "Account", "Tax rate", "Tax amount", "Region", "Project", `Amount ${invoice.currencyCode || 'USD'}`];
    
    headerRow.height = 30;
    
    // Header styles
    for (let c = 2; c <= 12; c++) {
      const cell = headerRow.getCell(c);
      cell.font = { size: 9, bold: true, color: { argb: "FF374151" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FAFB" } };
      cell.alignment = { vertical: "middle", horizontal: (c === 2 || c === 3 || c === 7 || c === 8) ? "left" : "right" };
      cell.border = { 
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } }
      } as Partial<ExcelJS.Borders>;
    }

    currentRow++;
    const items = invoice.lineItems || [];
    
    if (items.length === 0) {
      // Empty row if no items
      currentRow++;
    } else {
      items.forEach((item: NonNullable<XeroInvoiceData['lineItems']>[number]) => {
        const row = sheet.getRow(currentRow);
        const qty = item.quantity || 1;
        const price = item.unitAmount || 0;
        // HARDCODED TAX RATES (8.25%, 4%, 4.25%) - To be replaced with dynamic values from Xero's TaxType/LineItem API in the future.
        const taxRate = 0.0825;
        const taxAmt = price * qty * taxRate;
        const total = item.lineAmount || (qty * price);

        row.values = [
          "", 
          item.itemCode || "", 
          item.description || "", 
          qty, 
          price, 
          item.discountRate || "", 
          item.accountCode || "200 - Sales", 
          "Tax on Consulting (8.25%)", 
          taxAmt, 
          "", 
          "", 
          total
        ];

        row.height = 30;

        for (let c = 2; c <= 12; c++) {
          const cell = row.getCell(c);
          cell.font = valueFont;
          cell.alignment = { vertical: "middle", horizontal: (c === 2 || c === 3 || c === 7 || c === 8) ? "left" : "right", wrapText: true };
          cell.border = { 
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } }
          } as Partial<ExcelJS.Borders>;
          
          if (c === 5 || c === 9 || c === 12) {
             cell.numFmt = '"$"#,##0.00';
          }
        }
        currentRow++;
      });
    }

    // Add row button placeholder
    currentRow++;
    sheet.getCell(`B${currentRow}`).value = "Add row";
    sheet.getCell(`B${currentRow}`).font = { size: 9, color: { argb: "FF0284C7" }, bold: true };
    sheet.getCell(`B${currentRow}`).border = boxBorder as Partial<ExcelJS.Borders>;
    sheet.getCell(`B${currentRow}`).alignment = { horizontal: "center", vertical: "middle" };
    
    // --- Totals Section ---
    currentRow += 2;
    sheet.getCell(`K${currentRow}`).value = "Subtotal";
    sheet.getCell(`K${currentRow}`).font = valueFont;
    sheet.getCell(`K${currentRow}`).alignment = { horizontal: "left" };
    sheet.getCell(`L${currentRow}`).value = invoice.subTotal || 0;
    sheet.getCell(`L${currentRow}`).font = valueFont;
    sheet.getCell(`L${currentRow}`).alignment = { horizontal: "right" };
    sheet.getCell(`L${currentRow}`).numFmt = '"$"#,##0.00';

    // HARDCODED TAX RATES (8.25%, 4%, 4.25%) - To be replaced with dynamic values from Xero's TaxType/LineItem API in the future.
    const subtotal = invoice.subTotal || 0;
    const cityTax = subtotal * 0.04;
    const stateTax = subtotal * 0.0425;
    const calculatedTotal = subtotal + cityTax + stateTax;

    currentRow += 2;
    sheet.getCell(`K${currentRow}`).value = "Total City Tax 4%";
    sheet.getCell(`K${currentRow}`).font = valueFont;
    sheet.getCell(`K${currentRow}`).alignment = { horizontal: "left" };
    sheet.getCell(`L${currentRow}`).value = cityTax;
    sheet.getCell(`L${currentRow}`).font = valueFont;
    sheet.getCell(`L${currentRow}`).alignment = { horizontal: "right" };
    sheet.getCell(`L${currentRow}`).numFmt = '"$"#,##0.00';

    currentRow += 1;
    sheet.getCell(`K${currentRow}`).value = "Total State Tax 4.25%";
    sheet.getCell(`K${currentRow}`).font = valueFont;
    sheet.getCell(`K${currentRow}`).alignment = { horizontal: "left" };
    sheet.getCell(`L${currentRow}`).value = stateTax;
    sheet.getCell(`L${currentRow}`).font = valueFont;
    sheet.getCell(`L${currentRow}`).alignment = { horizontal: "right" };
    sheet.getCell(`L${currentRow}`).numFmt = '"$"#,##0.00';

    currentRow += 2;
    
    // Thick line before Total
    sheet.getCell(`K${currentRow}`).border = { top: { style: "medium", color: { argb: "FF9CA3AF" } }, bottom: { style: "medium", color: { argb: "FF9CA3AF" } } } as Partial<ExcelJS.Borders>;
    sheet.getCell(`L${currentRow}`).border = { top: { style: "medium", color: { argb: "FF9CA3AF" } }, bottom: { style: "medium", color: { argb: "FF9CA3AF" } } } as Partial<ExcelJS.Borders>;

    sheet.getCell(`K${currentRow}`).value = "Total";
    sheet.getCell(`K${currentRow}`).font = { size: 14, bold: true, color: { argb: "FF111827" } };
    sheet.getCell(`K${currentRow}`).alignment = { vertical: "middle" };
    
    sheet.getCell(`L${currentRow}`).value = calculatedTotal;
    sheet.getCell(`L${currentRow}`).font = { size: 14, bold: true, color: { argb: "FF111827" } };
    sheet.getCell(`L${currentRow}`).alignment = { horizontal: "right", vertical: "middle" };
    sheet.getCell(`L${currentRow}`).numFmt = '"$"#,##0.00';
    sheet.getRow(currentRow).height = 35;

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Generates an Excel report of a forecast.
   */
  static async generateForecastExcel(forecast: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // We need to fetch the detailed real data for this forecast. 
    // Since generateForecastExcel might not have the workspaceId readily available in the forecast object if not queried,
    // we'll assume forecast.workspaceId is available or we use a passed data object.
    // Wait, the API route passes the `forecast` object which has `workspaceId` and `id`.
    
    const { ForecastService } = await import("@/server/forecasting/forecast.service");
    let forecastData: any;
    try {
      forecastData = await ForecastService.getForecastData(forecast.id, forecast.workspaceId);
    } catch (e) {
      console.error("Failed to fetch detailed data for excel export", e);
      // fallback to empty if error
      forecastData = { months: [], cashPosition: [], tabs: {} };
    }

    const tabs = [
      { id: "invoices", label: "Invoices" },
      { id: "sales", label: "Sales" },
      { id: "costs", label: "Costs" },
      { id: "expenses", label: "Expenses" },
      { id: "other-pl", label: "Other P&L" },
      { id: "assets", label: "Assets" },
      { id: "liabilities", label: "Liabilities" },
      { id: "profit-loss", label: "Profit & Loss" },
      { id: "balance-sheet", label: "Balance Sheet" },
      { id: "cash-flow-statement", label: "Cash Flow Statement" }
    ];

    tabs.forEach(tab => {
      const sheet = workbook.addWorksheet(tab.label.substring(0, 31)); // Excel max length 31
      const tabData = forecastData.tabs[tab.id];
      if (!tabData) return;

      // Title
      sheet.mergeCells("A1:C2");
      const titleCell = sheet.getCell("A1");
      titleCell.value = `${forecast.name} - ${tab.label}`;
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { vertical: "middle", horizontal: "left" };

      // Meta
      sheet.getCell("A4").value = "Exported On:";
      sheet.getCell("B4").value = new Date().toLocaleDateString();

      // Headers (Months)
      let currentRow = 6;
      const headerRow = sheet.getRow(currentRow);
      headerRow.getCell(1).value = "Account";
      forecastData.months.forEach((m: string, i: number) => {
        headerRow.getCell(i + 2).value = m;
      });
      headerRow.font = { bold: true };
      currentRow++;

      // Cash Position
      const cashRow = sheet.getRow(currentRow);
      cashRow.getCell(1).value = "Cash Position";
      cashRow.getCell(1).font = { bold: true };
      forecastData.cashPosition.forEach((val: number, i: number) => {
        cashRow.getCell(i + 2).value = val;
        cashRow.getCell(i + 2).numFmt = '"$"#,##0.00';
      });
      currentRow += 2;

      // Summary
      const summaryRow = sheet.getRow(currentRow);
      summaryRow.getCell(1).value = `Total ${tab.label}`;
      summaryRow.getCell(1).font = { bold: true };
      tabData.summary.forEach((val: number, i: number) => {
        summaryRow.getCell(i + 2).value = val;
        summaryRow.getCell(i + 2).numFmt = '"$"#,##0.00';
      });
      currentRow += 2;

      // Groups and Children
      tabData.groups.forEach((group: any) => {
        const gRow = sheet.getRow(currentRow);
        gRow.getCell(1).value = group.name;
        gRow.getCell(1).font = { bold: true };
        group.months.forEach((val: number, i: number) => {
          gRow.getCell(i + 2).value = val;
          gRow.getCell(i + 2).numFmt = '"$"#,##0.00';
        });
        currentRow++;

        if (group.children) {
          group.children.forEach((child: any) => {
            const cRow = sheet.getRow(currentRow);
            cRow.getCell(1).value = `   ${child.name}`;
            child.months.forEach((val: number, i: number) => {
              cRow.getCell(i + 2).value = val;
              cRow.getCell(i + 2).numFmt = '"$"#,##0.00';
            });
            currentRow++;
          });
        }
        currentRow++;
      });

      // Columns width
      sheet.getColumn(1).width = 40;
      for (let i = 0; i < forecastData.months.length; i++) {
        sheet.getColumn(i + 2).width = 15;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
