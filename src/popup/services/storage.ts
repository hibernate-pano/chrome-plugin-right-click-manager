import { SearchEngine } from '../../shared/types';
import { defaultEngines } from '../../shared/defaultEngines';

// 记录错误日志
function logError(error: unknown, context: string) {
  console.error(`[Right Click Searcher] Error in storage.ts - ${context}:`, error);
}

// 获取搜索引擎列表
export const getSearchEngines = async (): Promise<SearchEngine[]> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.get('searchEngines', (result) => {
        try {
          if (chrome.runtime.lastError) {
            logError(chrome.runtime.lastError, 'getSearchEngines');
            reject(chrome.runtime.lastError);
            return;
          }
          
          if (result.searchEngines && Array.isArray(result.searchEngines) && result.searchEngines.length > 0) {
            resolve(result.searchEngines);
          } else {
            // 如果没有存储的搜索引擎，则使用默认值并保存
            chrome.storage.sync.set({ searchEngines: defaultEngines }, () => {
              if (chrome.runtime.lastError) {
                logError(chrome.runtime.lastError, 'getSearchEngines - setting defaults');
                reject(chrome.runtime.lastError);
                return;
              }
              resolve(defaultEngines);
            });
          }
        } catch (error) {
          logError(error, 'getSearchEngines - callback');
          reject(error);
        }
      });
    } catch (error) {
      logError(error, 'getSearchEngines');
      reject(error);
    }
  });
};

// 保存搜索引擎列表
export const saveSearchEngines = async (engines: SearchEngine[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.sync.set({ searchEngines: engines }, () => {
        if (chrome.runtime.lastError) {
          logError(chrome.runtime.lastError, 'saveSearchEngines');
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      });
    } catch (error) {
      logError(error, 'saveSearchEngines');
      reject(error);
    }
  });
};

// 重新排序搜索引擎
export const reorderSearchEngines = async (engineIds: string[]): Promise<SearchEngine[]> => {
  try {
    const engines = await getSearchEngines();
    
    // 创建ID到引擎的映射
    const engineMap = engines.reduce((map, engine) => {
      map[engine.id] = engine;
      return map;
    }, {} as Record<string, SearchEngine>);
    
    // 根据提供的ID顺序创建新的引擎数组
    const reorderedEngines = engineIds.map((id, index) => {
      if (engineMap[id]) {
        return {
          ...engineMap[id],
          order: index
        };
      }
      return null;
    }).filter(Boolean) as SearchEngine[];
    
    // 如果有引擎不在提供的ID列表中，将它们添加到末尾
    engines.forEach(engine => {
      if (!engineIds.includes(engine.id)) {
        reorderedEngines.push({
          ...engine,
          order: reorderedEngines.length
        });
      }
    });
    
    await saveSearchEngines(reorderedEngines);
    return reorderedEngines;
  } catch (error) {
    logError(error, 'reorderSearchEngines');
    throw error;
  }
};

// 添加新的搜索引擎
export const addSearchEngine = async (engine: SearchEngine): Promise<SearchEngine[]> => {
  try {
    const engines = await getSearchEngines();
    const newEngines = [...engines, engine];
    await saveSearchEngines(newEngines);
    return newEngines;
  } catch (error) {
    logError(error, 'addSearchEngine');
    throw error;
  }
};

// 更新搜索引擎
export const updateSearchEngine = async (engine: SearchEngine): Promise<SearchEngine[]> => {
  try {
    const engines = await getSearchEngines();
    const newEngines = engines.map((e) => (e.id === engine.id ? engine : e));
    await saveSearchEngines(newEngines);
    return newEngines;
  } catch (error) {
    logError(error, 'updateSearchEngine');
    throw error;
  }
};

// 删除搜索引擎
export const deleteSearchEngine = async (id: string): Promise<SearchEngine[]> => {
  try {
    const engines = await getSearchEngines();
    const newEngines = engines.filter((e) => e.id !== id);
    await saveSearchEngines(newEngines);
    return newEngines;
  } catch (error) {
    logError(error, 'deleteSearchEngine');
    throw error;
  }
}; 