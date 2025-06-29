import React, { useState } from 'react';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';
import { SearchEngine } from '../../shared/types';

const AddEngineForm: React.FC = () => {
  const { addEngine, error } = useSearchEngineStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    let iconUrl = icon;
    if (!iconUrl) {
      try {
        const urlObj = new URL(searchUrl);
        iconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`;
      } catch (error) {
        iconUrl = '';
      }
    }
    
    setIsSubmitting(true);
    
    const newEngine: SearchEngine = {
      id: Date.now().toString(),
      name,
      url: searchUrl,
      icon: iconUrl,
      isDefault: false
    };
    
    await addEngine(newEngine);
    
    // 重置表单
    setName('');
    setUrl('');
    setIcon('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-1">添加新搜索引擎</h3>
      
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