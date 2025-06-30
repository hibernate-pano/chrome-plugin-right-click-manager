import { SearchEngine } from '../shared/types';
import { defaultEngines } from '../shared/defaultEngines';

// 记录错误日志
function logError(error: unknown, context: string) {
  console.error(`[Right Click Searcher] Error in ${context}:`, error);
}

// 创建上下文菜单
function createContextMenus(engines: SearchEngine[]) {
  try {
    // 清除现有菜单
    chrome.contextMenus.removeAll();

    // 创建父菜单
    chrome.contextMenus.create({
      id: 'search-with',
      title: '使用搜索引擎搜索 "%s"',
      contexts: ['selection']
    });

    // 按排序顺序对引擎进行排序
    const sortedEngines = [...engines].sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999;
      const orderB = b.order !== undefined ? b.order : 999;
      return orderA - orderB;
    });

    // 为每个启用的搜索引擎创建子菜单
    sortedEngines.forEach(engine => {
      chrome.contextMenus.create({
        id: `search-${engine.id}`,
        parentId: 'search-with',
        title: engine.name,
        contexts: ['selection']
      });
    });
  } catch (error) {
    logError(error, 'createContextMenus');
  }
}

// 处理上下文菜单点击
chrome.contextMenus.onClicked.addListener((info) => {
  try {
    if (!info.menuItemId.toString().startsWith('search-') || info.menuItemId === 'search-with') {
      return;
    }

    const engineId = info.menuItemId.toString().replace('search-', '');
    const selectedText = info.selectionText || '';

    // 获取搜索引擎列表
    chrome.storage.sync.get('searchEngines', (result) => {
      try {
        const engines = Array.isArray(result.searchEngines) ? result.searchEngines : [];
        const engine = engines.find(e => e.id === engineId);

        if (engine) {
          // 构建搜索URL并打开
          const searchUrl = engine.url.replace('%s', encodeURIComponent(selectedText));
          chrome.tabs.create({ url: searchUrl });
        }
      } catch (error) {
        logError(error, 'contextMenus.onClicked storage callback');
      }
    });
  } catch (error) {
    logError(error, 'contextMenus.onClicked');
  }
});

// 初始化扩展
function initializeExtension() {
  try {
    // 获取搜索引擎列表并创建上下文菜单
    chrome.storage.sync.get('searchEngines', (result) => {
      try {
        if (chrome.runtime.lastError) {
          logError(chrome.runtime.lastError, 'initializeExtension');
          return;
        }

        // 检查是否有搜索引擎数据
        if (result.searchEngines && Array.isArray(result.searchEngines) && result.searchEngines.length > 0) {
          // 如果有，直接使用
          createContextMenus(result.searchEngines);
        } else {
          // 如果没有，设置默认搜索引擎并创建菜单
          chrome.storage.sync.set({ searchEngines: defaultEngines }, () => {
            if (chrome.runtime.lastError) {
              logError(chrome.runtime.lastError, 'initializeExtension - setting defaults');
              return;
            }
            createContextMenus(defaultEngines);
          });
        }
      } catch (error) {
        logError(error, 'initializeExtension storage callback');
      }
    });
  } catch (error) {
    logError(error, 'initializeExtension');
  }
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
  try {
    if (area === 'sync' && changes.searchEngines) {
      const engines = Array.isArray(changes.searchEngines.newValue) ? changes.searchEngines.newValue : [];
      createContextMenus(engines);
    }
  } catch (error) {
    logError(error, 'storage.onChanged');
  }
});

// 监听安装/更新事件
chrome.runtime.onInstalled.addListener((details) => {
  try {
    initializeExtension();
    
    // 首次安装时打开欢迎页面
    if (details.reason === 'install') {
      // 打开欢迎页面
      chrome.tabs.create({
        url: chrome.runtime.getURL('src/welcome/index.html')
      });
    }
  } catch (error) {
    logError(error, 'runtime.onInstalled');
  }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message) => {
  try {
    if (message.type === 'updateContextMenus') {
      initializeExtension();
    }
  } catch (error) {
    logError(error, 'runtime.onMessage');
  }
  return true;
}); 