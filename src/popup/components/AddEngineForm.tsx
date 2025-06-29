import React, { useState, useEffect } from 'react';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';
import { SearchEngine } from '../../shared/types';

const AddEngineForm: React.FC = () => {
  const { addEngine, error } = useSearchEngineStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // 当URL或图标URL变化时，更新图标预览
  useEffect(() => {
    if (icon) {
      setIconPreview(icon);
    } else if (url) {
      try {
        const urlObj = new URL(url);
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
        setIconPreview(faviconUrl);
      } catch (error) {
        setIconPreview(null);
      }
    } else {
      setIconPreview(null);
    }
  }, [url, icon]);

  // 获取网站图标的多种尝试
  const getFaviconUrl = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      
      // 尝试多种获取favicon的方式
      const options = [
        // Google的favicon服务
        `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`,
        // 直接从网站根目录获取
        `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
        // 从apple-touch-icon获取
        `${urlObj.protocol}//${urlObj.hostname}/apple-touch-icon.png`,
      ];
      
      return options[0]; // 默认使用Google的服务，最可靠
    } catch (error) {
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !url) {
      return;
    }
    
    // 确保URL包含%s
    let searchUrl = url;
    if (!searchUrl.includes('%s')) {
      searchUrl += '%s';
    }
    
    // 如果没有提供图标，尝试使用网站favicon
    let iconUrl = icon || getFaviconUrl(searchUrl);
    
    setIsSubmitting(true);
    
    const newEngine: SearchEngine = {
      id: Date.now().toString(),
      name,
      url: searchUrl,
      icon: iconUrl,
      order: 999 // 新添加的引擎默认排在最后
    };
    
    await addEngine(newEngine);
    
    // 重置表单
    setName('');
    setUrl('');
    setIcon('');
    setIconPreview(null);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-1">添加新搜索引擎</h3>
      
      <div className="flex items-start space-x-3">
        <div className="flex-grow space-y-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              名称
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Google"
              required
            />
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              搜索URL (使用 %s 作为搜索词占位符)
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://www.google.com/search?q=%s"
              required
            />
          </div>
          
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
              图标URL (可选)
            </label>
            <input
              type="text"
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="https://www.google.com/favicon.ico"
            />
          </div>
        </div>
        
        {/* 图标预览 */}
        <div className="flex-shrink-0 pt-6">
          {iconPreview ? (
            <div className="w-16 h-16 flex items-center justify-center border rounded">
              <img 
                src={iconPreview} 
                alt="图标预览" 
                className="max-w-full max-h-full"
                onError={(e) => {
                  // 如果加载失败，显示一个默认图标
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmVhdGhlciBmZWF0aGVyLWltYWdlIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==';
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center border rounded bg-gray-100 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting || !name || !url}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSubmitting ? '添加中...' : '添加搜索引擎'}
        </button>
      </div>
    </form>
  );
};

export default AddEngineForm; 