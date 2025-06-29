/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString();
}

/**
 * 从URL中提取域名
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
}

/**
 * 获取网站favicon
 */
export function getFavicon(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}`;
} 