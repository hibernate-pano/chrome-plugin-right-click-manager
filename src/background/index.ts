import { SearchEngine } from '../shared/types';

// 创建上下文菜单
function createContextMenus(engines: SearchEngine[]) {
  // 清除现有菜单
  chrome.contextMenus.removeAll();

  // 创建父菜单
  chrome.contextMenus.create({
    id: 'search-with',
    title: '使用搜索引擎搜索 "%s"',
    contexts: ['selection']
  });

  // 为每个启用的搜索引擎创建子菜单
  engines.forEach(engine => {
    chrome.contextMenus.create({
      id: `search-${engine.id}`,
      parentId: 'search-with',
      title: engine.name,
      contexts: ['selection']
    });
  });
}

// 处理上下文菜单点击
chrome.contextMenus.onClicked.addListener((info) => {
  if (!info.menuItemId.toString().startsWith('search-') || info.menuItemId === 'search-with') {
    return;
  }

  const engineId = info.menuItemId.toString().replace('search-', '');
  const selectedText = info.selectionText || '';

  // 获取搜索引擎列表
  chrome.storage.sync.get('searchEngines', (result) => {
    const engines = Array.isArray(result.searchEngines) ? result.searchEngines : [];
    const engine = engines.find(e => e.id === engineId);

    if (engine) {
      // 构建搜索URL并打开
      const searchUrl = engine.url.replace('%s', encodeURIComponent(selectedText));
      chrome.tabs.create({ url: searchUrl });
    }
  });
});

// 初始化扩展
function initializeExtension() {
  // 获取搜索引擎列表并创建上下文菜单
  chrome.storage.sync.get('searchEngines', (result) => {
    const engines = Array.isArray(result.searchEngines) ? result.searchEngines : [];
    createContextMenus(engines);
  });
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.searchEngines) {
    const engines = Array.isArray(changes.searchEngines.newValue) ? changes.searchEngines.newValue : [];
    createContextMenus(engines);
  }
});

// 监听安装/更新事件
chrome.runtime.onInstalled.addListener(() => {
  initializeExtension();
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'updateContextMenus') {
    initializeExtension();
  }
  return true;
}); 