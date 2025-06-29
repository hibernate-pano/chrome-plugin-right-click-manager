import { DEFAULT_SEARCH_ENGINES, SEARCH_ENGINE_ORDER } from '@/shared/constants';
import { SearchEngines } from '@/shared/types';

// 确保菜单创建的互斥性
let menuCreationInProgress = false;

/**
 * 初始化上下文菜单
 */
function initializeContextMenus() {
  // 如果正在创建菜单，则跳过
  if (menuCreationInProgress) {
    return;
  }

  menuCreationInProgress = true;

  // 清除所有现有的上下文菜单
  chrome.contextMenus.removeAll(() => {
    // 创建父菜单
    chrome.contextMenus.create({
      id: 'searchWith',
      title: 'Search with...',
      contexts: ['selection']
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error creating parent menu:', chrome.runtime.lastError);
        menuCreationInProgress = false;
        return;
      }

      // 从存储中获取搜索引擎配置
      chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
        const searchEngines = (result.searchEngines as SearchEngines) || DEFAULT_SEARCH_ENGINES;
        const order = (result.engineOrder as string[]) || SEARCH_ENGINE_ORDER;

        // 按顺序创建菜单项
        let itemsCreated = 0;
        const totalItems = order.filter((url: string) => searchEngines[url]?.enabled).length;

        order.forEach((url: string) => {
          const engine = searchEngines[url];
          if (engine && engine.enabled) {
            chrome.contextMenus.create({
              id: url,
              title: engine.name,
              parentId: 'searchWith',
              contexts: ['selection']
            }, () => {
              if (chrome.runtime.lastError) {
                console.error('Error creating menu item:', chrome.runtime.lastError);
              }
              
              itemsCreated++;
              if (itemsCreated === totalItems) {
                menuCreationInProgress = false;
              }
            });
          }
        });

        // 如果没有启用的搜索引擎，也要释放锁
        if (totalItems === 0) {
          menuCreationInProgress = false;
        }
      });
    });
  });
}

// 处理上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'searchWith' && info.selectionText) {
    // 使用选中的文本和搜索引擎 URL 进行搜索
    const searchUrl = (info.menuItemId as string).replace('%s', encodeURIComponent(info.selectionText));
    
    // 在当前页面执行脚本来打开新标签页
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (url: string) => { window.open(url, '_blank'); },
        args: [searchUrl]
      });
    }
  }
});

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'updateContextMenus') {
    // 等待一小段时间再更新菜单，避免频繁更新
    setTimeout(initializeContextMenus, 100);
  }
});

// 扩展安装或更新时初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  
  // 初始化存储
  chrome.storage.sync.get(['searchEngines'], (result) => {
    console.log('Current storage:', result);
    
    if (!result.searchEngines) {
      console.log('Initializing default search engines');
      chrome.storage.sync.set({ 
        searchEngines: DEFAULT_SEARCH_ENGINES,
        engineOrder: SEARCH_ENGINE_ORDER
      }, () => {
        console.log('Storage initialized');
        initializeContextMenus();
      });
    } else {
      console.log('Using existing search engines');
      initializeContextMenus();
    }
  });
}); 