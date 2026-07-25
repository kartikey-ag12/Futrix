import ExcelJS from "exceljs";

export interface InvoiceData {
  contactName: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  status?: string;
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
      sheet.getCell(cellRef).border = borderStyle as any;
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
    await workbook.xlsx.load(buffer);
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
}
