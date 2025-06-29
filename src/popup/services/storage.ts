import { SearchEngine } from '../../shared/types';

// 默认搜索引擎
const defaultEngines: SearchEngine[] = [
  {
    id: '1',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    icon: 'https://www.google.com/favicon.ico',
    isDefault: true
  },
  {
    id: '2',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    icon: 'https://www.bing.com/favicon.ico',
    isDefault: false
  },
  {
    id: '3',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=%s',
    icon: 'https://www.baidu.com/favicon.ico',
    isDefault: false
  }
];

// 获取搜索引擎列表
export const getSearchEngines = async (): Promise<SearchEngine[]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('searchEngines', (result) => {
      if (result.searchEngines && Array.isArray(result.searchEngines) && result.searchEngines.length > 0) {
        resolve(result.searchEngines);
      } else {
        // 如果没有存储的搜索引擎，则使用默认值并保存
        chrome.storage.sync.set({ searchEngines: defaultEngines });
        resolve(defaultEngines);
      }
    });
  });
};

// 保存搜索引擎列表
export const saveSearchEngines = async (engines: SearchEngine[]): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ searchEngines: engines }, () => {
      resolve();
    });
  });
};

// 添加新的搜索引擎
export const addSearchEngine = async (engine: SearchEngine): Promise<SearchEngine[]> => {
  const engines = await getSearchEngines();
  const newEngines = [...engines, engine];
  await saveSearchEngines(newEngines);
  return newEngines;
};

// 更新搜索引擎
export const updateSearchEngine = async (engine: SearchEngine): Promise<SearchEngine[]> => {
  const engines = await getSearchEngines();
  const newEngines = engines.map((e) => (e.id === engine.id ? engine : e));
  await saveSearchEngines(newEngines);
  return newEngines;
};

// 删除搜索引擎
export const deleteSearchEngine = async (id: string): Promise<SearchEngine[]> => {
  const engines = await getSearchEngines();
  const newEngines = engines.filter((e) => e.id !== id);
  await saveSearchEngines(newEngines);
  return newEngines;
};

// 设置默认搜索引擎
export const setDefaultEngine = async (id: string): Promise<SearchEngine[]> => {
  const engines = await getSearchEngines();
  const newEngines = engines.map((e) => ({
    ...e,
    isDefault: e.id === id
  }));
  await saveSearchEngines(newEngines);
  return newEngines;
}; 