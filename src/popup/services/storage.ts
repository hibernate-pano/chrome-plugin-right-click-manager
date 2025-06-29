import { UserConfig, SearchEngines } from '@/shared/types';
import { DEFAULT_SEARCH_ENGINES, SEARCH_ENGINE_ORDER } from '@/shared/constants';

/**
 * 从Chrome存储中获取所有配置
 */
export async function getAllConfig(): Promise<Partial<UserConfig>> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => {
      resolve(result as Partial<UserConfig>);
    });
  });
}

/**
 * 获取搜索引擎配置
 */
export async function getSearchEngines(): Promise<{
  searchEngines: SearchEngines;
  engineOrder: string[];
}> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
      resolve({
        searchEngines: result.searchEngines || DEFAULT_SEARCH_ENGINES,
        engineOrder: result.engineOrder || SEARCH_ENGINE_ORDER,
      });
    });
  });
}

/**
 * 保存搜索引擎配置
 */
export async function saveSearchEngines(
  searchEngines: SearchEngines,
  engineOrder: string[]
): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        searchEngines,
        engineOrder,
      },
      () => {
        resolve();
      }
    );
  });
}

/**
 * 添加新的搜索引擎
 */
export async function addSearchEngine(
  url: string,
  name: string,
  enabled = true
): Promise<void> {
  const { searchEngines, engineOrder } = await getSearchEngines();
  
  // 添加新的搜索引擎
  searchEngines[url] = { name, enabled };
  
  // 添加到引擎顺序列表
  if (!engineOrder.includes(url)) {
    engineOrder.push(url);
  }
  
  await saveSearchEngines(searchEngines, engineOrder);
}

/**
 * 删除搜索引擎
 */
export async function deleteSearchEngine(url: string): Promise<void> {
  const { searchEngines, engineOrder } = await getSearchEngines();
  
  // 删除搜索引擎
  if (searchEngines[url]) {
    delete searchEngines[url];
  }
  
  // 从顺序列表中移除
  const index = engineOrder.indexOf(url);
  if (index !== -1) {
    engineOrder.splice(index, 1);
  }
  
  await saveSearchEngines(searchEngines, engineOrder);
}

/**
 * 更新搜索引擎启用状态
 */
export async function updateSearchEngineStatus(
  url: string,
  enabled: boolean
): Promise<void> {
  const { searchEngines, engineOrder } = await getSearchEngines();
  
  if (searchEngines[url]) {
    searchEngines[url].enabled = enabled;
    await saveSearchEngines(searchEngines, engineOrder);
  }
}

/**
 * 更新搜索引擎顺序
 */
export async function updateEngineOrder(newOrder: string[]): Promise<void> {
  const { searchEngines } = await getSearchEngines();
  await saveSearchEngines(searchEngines, newOrder);
}

/**
 * 保存完整配置
 */
export async function saveFullConfig(config: UserConfig): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(config, () => {
      resolve();
    });
  });
} 