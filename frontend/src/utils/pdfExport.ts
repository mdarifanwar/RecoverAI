export function exportReportToPDF(
  title: string,
  summaryData: { label: string; value: string }[],
  tableHeaders: string[],
  tableRows: (string | number)[][]
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export PDF report.");
    return;
  }

  const currentDate = new Date().toLocaleString();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - ${currentDate}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1c3218;
            background-color: #ffffff;
            margin: 0;
            padding: 20px;
          }
          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #1c3218;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .logo-title {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: #1c3218;
            font-family: monospace;
          }
          .report-tag {
            font-size: 11px;
            font-weight: bold;
            background-color: #d8e5b6;
            color: #1c3218;
            padding: 6px 12px;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 24px;
          }
          .summary-card {
            background-color: #f9f8f3;
            border: 1px solid #c4c7b7;
            border-radius: 8px;
            padding: 14px;
          }
          .summary-card-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            color: #626556;
          }
          .summary-card-val {
            font-size: 22px;
            font-weight: bold;
            font-family: monospace;
            color: #1c3218;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            font-size: 12px;
          }
          th {
            background-color: #1c3218;
            color: #f4f3ec;
            text-align: left;
            padding: 10px 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #c4c7b7;
            font-family: monospace;
          }
          tr:nth-child(even) {
            background-color: #f9f8f3;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #c4c7b7;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #626556;
          }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div>
            <div class="logo-title">🛡 RECOVERAI</div>
            <div style="font-size: 14px; font-weight: bold; margin-top: 4px;">${title}</div>
          </div>
          <div>
            <span class="report-tag">OFFICIAL AUDIT REPORT</span>
            <div style="font-size: 11px; text-align: right; margin-top: 4px; color: #626556;">Generated: ${currentDate}</div>
          </div>
        </div>

        <div class="summary-grid">
          ${summaryData
            .map(
              (item) => `
            <div class="summary-card">
              <div class="summary-card-title">${item.label}</div>
              <div class="summary-card-val">${item.value}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <table>
          <thead>
            <tr>
              ${tableHeaders.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <div>RecoverAI Revenue Recovery Platform • Multi-Stage Autonomous Interventions</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
