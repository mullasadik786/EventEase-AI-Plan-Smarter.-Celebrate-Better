import { Currency } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  if (currency === 'INR') {
    // Format in Indian numbering system (Lakhs / Crores)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getDaysRemaining(targetDateStr: string): number {
  try {
    const target = new Date(targetDateStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function sanitizeCSVCell(val: string | number): string {
  let str = val === null || val === undefined ? '' : String(val).trim();
  // Protect against CSV / Excel Formula Injection (starts with =, +, -, @, tab, cr)
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  let result = str.replace(/"/g, '""');
  if (result.search(/("|,|\n|\r)/g) >= 0) {
    result = `"${result}"`;
  }
  return result;
}

export function exportToCSV(filename: string, rows: (string | number)[][]) {
  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let rowStr = '';
    for (let j = 0; j < row.length; j++) {
      if (j > 0) rowStr += ',';
      rowStr += sanitizeCSVCell(row[j]);
    }
    csvFile += rowStr + '\n';
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
