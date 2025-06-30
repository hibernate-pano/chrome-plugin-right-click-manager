import { SearchEngine } from './types';

// 默认搜索引擎列表
export const defaultEngines: SearchEngine[] = [
  {
    id: '1',
    name: 'Google',
    url: 'https://www.google.com/search?q=%s',
    icon: 'https://www.google.com/favicon.ico',
    order: 0
  },
  {
    id: '2',
    name: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
    icon: 'https://www.bing.com/favicon.ico',
    order: 1
  },
  {
    id: '3',
    name: 'Baidu',
    url: 'https://www.baidu.com/s?wd=%s',
    icon: 'https://www.baidu.com/favicon.ico',
    order: 2
  }
]; 