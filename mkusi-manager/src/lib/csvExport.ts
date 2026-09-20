export function exportToCSV(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);

  const escapeCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escapeCell(row[h])).join(',')),
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface CSVSection {
  title: string;
  rows: Record<string, unknown>[];
}

export function exportMultiSectionCSV(filename: string, sections: CSVSection[]) {
  const escapeCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const blocks: string[] = [];

  for (const section of sections) {
    blocks.push(`# ${section.title}`);
    if (section.rows.length === 0) {
      blocks.push('(no data)');
      blocks.push('');
      continue;
    }
    const headers = Object.keys(section.rows[0]);
    blocks.push(headers.join(','));
    section.rows.forEach(row => {
      blocks.push(headers.map(h => escapeCell(row[h])).join(','));
    });
    blocks.push(''); // blank line between sections
  }

  const csvContent = blocks.join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}