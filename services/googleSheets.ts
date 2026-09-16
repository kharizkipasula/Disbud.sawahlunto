import { NewsItem } from '../types';

export const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++; // Skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || char === '\r') {
        if (currentCell || currentRow.length > 0) {
          currentRow.push(currentCell.trim());
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      } else {
        currentCell += char;
      }
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  
  return rows;
};

export const fetchNewsFromSheet = async (url: string): Promise<NewsItem[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sheet');
    
    const text = await response.text();
    const rows = parseCSV(text);
    
    // Assume First Row is Header. 
    // Expected Columns: Date, TitleEN, TitleID, SummaryEN, SummaryID, ImageURL, ContentEN, ContentID
    // Skip header row (index 0)
    
    return rows.slice(1).map((cols, index) => {
        // Fallbacks for missing columns
        if (cols.length < 3) return null;

        return {
            id: `sheet-${index}`,
            date: cols[0] || new Date().toISOString().split('T')[0],
            title: { en: cols[1] || 'No Title', id: cols[2] || 'Tanpa Judul' },
            summary: { en: cols[3] || '', id: cols[4] || '' },
            imageUrl: cols[5] || 'https://picsum.photos/400/300',
            content: { en: cols[6] || '', id: cols[7] || '' }
        } as NewsItem;
    }).filter((item): item is NewsItem => item !== null);
    
  } catch (error) {
    console.error("Google Sheet Error:", error);
    return [];
  }
};