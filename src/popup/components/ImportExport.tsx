import React, { useRef, useState } from 'react';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';
import { SearchEngine } from '../../shared/types';

const ImportExport: React.FC = () => {
  const { engines, fetchEngines } = useSearchEngineStore();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 导出搜索引擎配置
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(engines, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `right-click-searcher-config-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setMessage({ text: '导出成功', type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ text: '导出失败', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // 导入搜索引擎配置
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedEngines = JSON.parse(text) as SearchEngine[];
      
      // 验证导入的数据
      if (!Array.isArray(importedEngines) || importedEngines.some(e => !e.id || !e.name || !e.url)) {
        throw new Error('无效的配置文件格式');
      }
      
      // 保存到存储
      chrome.storage.sync.set({ searchEngines: importedEngines }, async () => {
        await fetchEngines();
        setMessage({ text: '导入成功', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      });
    } catch (error) {
      setMessage({ text: '导入失败：无效的配置文件', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">导入/导出配置</h3>
        <div className="space-x-2">
          <button
            onClick={handleImport}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            title="导入搜索引擎配置"
          >
            导入
          </button>
          <button
            onClick={handleExport}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            title="导出搜索引擎配置"
          >
            导出
          </button>
        </div>
      </div>
      
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      
      {/* 消息提示 */}
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default ImportExport; 