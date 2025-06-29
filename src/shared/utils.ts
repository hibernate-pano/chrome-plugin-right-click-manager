import { UserConfig } from './types';
import { DEFAULT_SEARCH_ENGINES, SEARCH_ENGINE_ORDER } from './constants';

/**
 * 合并配置
 */
export function mergeConfigurations(local: Partial<UserConfig>, remote: Partial<UserConfig>): UserConfig {
  const merged: UserConfig = {
    searchEngines: { ...DEFAULT_SEARCH_ENGINES },
    engineOrder: [...SEARCH_ENGINE_ORDER],
  };

  // 合并本地配置
  if (local.searchEngines) {
    merged.searchEngines = { ...merged.searchEngines, ...local.searchEngines };
    if (local.engineOrder) {
      merged.engineOrder = mergeOrder(merged.engineOrder, local.engineOrder);
    }
  }

  // 合并远程配置
  if (remote.searchEngines) {
    merged.searchEngines = { ...merged.searchEngines, ...remote.searchEngines };
    if (remote.engineOrder) {
      merged.engineOrder = mergeOrder(merged.engineOrder, remote.engineOrder);
    }
  }

  return merged;
}

/**
 * 合并搜索引擎顺序
 */
export function mergeOrder(baseOrder: string[], newOrder: string[]): string[] {
  // 保留所有基础顺序中的项
  const merged = [...baseOrder];

  // 添加新顺序中的独特项
  newOrder.forEach((url) => {
    if (!merged.includes(url)) {
      merged.push(url);
    }
  });

  return merged;
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 