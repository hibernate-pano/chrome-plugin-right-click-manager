import { SearchEngines } from './types';

// 默认搜索引擎配置和顺序
export const SEARCH_ENGINE_ORDER = [
  'https://www.google.com/search?q=%s',
  'https://www.baidu.com/s?wd=%s',
  'https://duckduckgo.com/?q=%s',
  'https://www.bing.com/search?q=%s',
  'https://felo.ai/search?q=%s',
  'https://www.perplexity.ai/?q=%s',
  'https://chat.openai.com/?q=%s',
  'https://claude.ai/chat?q=%s',
  'https://www.deepseek.com/search?q=%s',
  'https://github.com/search?q=%s',
  'https://www.zhihu.com/search?q=%s',
  'https://search.bilibili.com/all?keyword=%s',
  'https://www.youtube.com/results?search_query=%s',
  'https://www.douyin.com/search?keyword=%s',
  'https://www.tiktok.com/search?q=%s',
  'https://www.instagram.com/search?q=%s',
  'https://www.reddit.com/search?q=%s',
  'https://www.quora.com/search?q=%s',
  'https://www.xiaohongshu.com/search_result?keyword=%s',
  'https://x.com/search?q=%s'
];

export const DEFAULT_SEARCH_ENGINES: SearchEngines = {
  'https://www.google.com/search?q=%s': {
    name: 'Google',
    enabled: true
  },
  'https://www.baidu.com/s?wd=%s': {
    name: 'Baidu',
    enabled: true
  },
  'https://duckduckgo.com/?q=%s': {
    name: 'DuckDuckGo',
    enabled: true
  },
  'https://www.bing.com/search?q=%s': {
    name: 'Bing',
    enabled: true
  },
  'https://felo.ai/search?q=%s': {
    name: 'Felo',
    enabled: true
  },
  'https://www.perplexity.ai/?q=%s': {
    name: 'Perplexity',
    enabled: true
  },
  'https://chat.openai.com/?q=%s': {
    name: 'ChatGPT',
    enabled: true
  },
  'https://claude.ai/chat?q=%s': {
    name: 'Claude AI',
    enabled: true
  },
  'https://www.deepseek.com/search?q=%s': {
    name: 'DeepSeek',
    enabled: true
  },
  'https://github.com/search?q=%s': {
    name: 'GitHub',
    enabled: true
  },
  'https://www.zhihu.com/search?q=%s': {
    name: 'Zhihu',
    enabled: true
  },
  'https://search.bilibili.com/all?keyword=%s': {
    name: 'Bilibili',
    enabled: true
  },
  'https://www.youtube.com/results?search_query=%s': {
    name: 'YouTube',
    enabled: true
  },
  'https://www.douyin.com/search?keyword=%s': {
    name: 'Douyin',
    enabled: true
  },
  'https://www.tiktok.com/search?q=%s': {
    name: 'TikTok',
    enabled: true
  },
  'https://www.instagram.com/search?q=%s': {
    name: 'Instagram',
    enabled: true
  },
  'https://www.reddit.com/search?q=%s': {
    name: 'Reddit',
    enabled: true
  },
  'https://www.quora.com/search?q=%s': {
    name: 'Quora',
    enabled: true
  } ,
  'https://www.xiaohongshu.com/search_result?keyword=%s': {
    name: '小红书',
    enabled: true
  },
  'https://x.com/search?q=%s': {
    name: 'X',
    enabled: true
  }
}; 