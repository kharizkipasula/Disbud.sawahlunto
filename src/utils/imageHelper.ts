/**
 * Utility helper to resolve and format image URLs,
 * including direct conversion for Google Drive shareable links.
 */

export const isGoogleDriveUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  return trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com') || trimmed.includes('googleusercontent.com/d/');
};

export const extractGoogleDriveId = (url: string | undefined | null): string => {
  if (!url) return '';
  const trimmed = url.trim().replace(/^["']|["']$/g, '');
  
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com')) {
    const directLhMatch = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    if (directLhMatch && directLhMatch[1]) return directLhMatch[1];
    return '';
  }

  // Common Google Drive link formats:
  // 1. /file/d/FILE_ID/...
  // 2. ?id=FILE_ID or &id=FILE_ID
  // 3. /d/FILE_ID
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  return '';
};

export const formatGoogleDriveUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  const trimmed = url.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return '';

  const fileId = extractGoogleDriveId(trimmed);
  if (fileId) {
    // Google's high-speed public CDN format for Google Drive files
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
};

export const getSafeImageUrl = (
  url: string | undefined | null, 
  fallback = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800'
): string => {
  if (!url || !url.trim()) return fallback;
  const formatted = formatGoogleDriveUrl(url);
  return formatted || fallback;
};

