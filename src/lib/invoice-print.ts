import { products } from "@/lib/mock-data";

type InvoiceLine = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type InvoicePayload = {
  title: string;
  reference: string;
  date: string;
  effectiveDate: string;
  contact: string;
  locationLabel: string;
  locationValue: string;
  status: string;
  lines: InvoiceLine[];
};

const companyName = "CoreInventory";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildInvoiceHtml(payload: InvoicePayload) {
  const subtotal = payload.lines.reduce((total, line) => total + line.quantity * line.unitPrice, 0);
  const vat = subtotal * 0.075;
  const grandTotal = subtotal + vat;

  const rows = payload.lines
    .map((line, index) => {
      const lineTotal = line.quantity * line.unitPrice;
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(line.name)}</td>
          <td class="text-right">${line.quantity}</td>
          <td class="text-right">${formatCurrency(line.unitPrice)}</td>
          <td class="text-right">${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(payload.title)} ${escapeHtml(payload.reference)}</title>
        <style>
          body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            margin: 32px;
            color: #111827;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 24px;
          }
          .brand {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.4px;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .muted {
            color: #6b7280;
          }
          .meta {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px 16px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .meta b {
            display: inline-block;
            width: 130px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }
          th,
          td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            font-size: 14px;
          }
          th {
            background: #f9fafb;
            text-align: left;
          }
          .text-right {
            text-align: right;
          }
          .totals {
            margin-top: 16px;
            margin-left: auto;
            width: 320px;
            font-size: 14px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 0;
          }
          .totals-row.total {
            font-size: 16px;
            font-weight: 700;
            border-bottom: 2px solid #111827;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
          }
          @media print {
            body {
              margin: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">${companyName}</div>
            <div class="muted">Inventory Management Platform</div>
          </div>
          <div class="title">Invoice</div>
        </div>

        <div class="meta">
          <div><b>Document:</b> ${escapeHtml(payload.title)}</div>
          <div><b>Reference:</b> ${escapeHtml(payload.reference)}</div>
          <div><b>Date:</b> ${escapeHtml(payload.date)}</div>
          <div><b>Effective Date:</b> ${escapeHtml(payload.effectiveDate)}</div>
          <div><b>Contact:</b> ${escapeHtml(payload.contact)}</div>
          <div><b>Status:</b> ${escapeHtml(payload.status)}</div>
          <div><b>${escapeHtml(payload.locationLabel)}:</b> ${escapeHtml(payload.locationValue)}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 56px">#</th>
              <th>Product</th>
              <th style="width: 120px" class="text-right">Qty</th>
              <th style="width: 160px" class="text-right">Unit Price</th>
              <th style="width: 180px" class="text-right">Line Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
          <div class="totals-row"><span>VAT (7.5%)</span><span>${formatCurrency(vat)}</span></div>
          <div class="totals-row total"><span>Total</span><span>${formatCurrency(grandTotal)}</span></div>
        </div>

        <div class="footer">
          Generated by ${companyName} on ${new Date().toLocaleString("en-NG")}
        </div>
      </body>
    </html>
  `;
}

function printHtmlDocument(title: string, html: string) {
  const popup = window.open("", "_blank", "width=960,height=800");
  if (!popup) {
    throw new Error("Unable to open print window. Please allow popups and try again.");
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.document.title = title;

  popup.focus();
  popup.print();
}

export function printDeliveryInvoice(delivery: {
  reference: string;
  date: string;
  effectiveDate: string;
  contact: string;
  destinationAddr: string;
  status: string;
  products: { productId: string; productName: string; quantity: number }[];
}) {
  const lines = delivery.products.map((line) => {
    const unitPrice = products.find((product) => product.id === line.productId)?.unitCost ?? 0;
    return {
      name: line.productName,
      quantity: line.quantity,
      unitPrice,
    };
  });

  const html = buildInvoiceHtml({
    title: "Delivery Invoice",
    reference: delivery.reference,
    date: delivery.date,
    effectiveDate: delivery.effectiveDate,
    contact: delivery.contact,
    locationLabel: "Destination",
    locationValue: delivery.destinationAddr,
    status: delivery.status,
    lines,
  });

  printHtmlDocument(`Invoice ${delivery.reference}`, html);
}

export function printReceiptInvoice(receipt: {
  reference: string;
  date: string;
  effectiveDate: string;
  contact: string;
  sourceLocation: string;
  status: string;
  products: { productId: string; productName: string; quantity: number }[];
}) {
  const lines = receipt.products.map((line) => {
    const unitPrice = products.find((product) => product.id === line.productId)?.unitCost ?? 0;
    return {
      name: line.productName,
      quantity: line.quantity,
      unitPrice,
    };
  });

  const html = buildInvoiceHtml({
    title: "Receipt Invoice",
    reference: receipt.reference,
    date: receipt.date,
    effectiveDate: receipt.effectiveDate,
    contact: receipt.contact,
    locationLabel: "Source",
    locationValue: receipt.sourceLocation,
    status: receipt.status,
    lines,
  });

  printHtmlDocument(`Invoice ${receipt.reference}`, html);
}