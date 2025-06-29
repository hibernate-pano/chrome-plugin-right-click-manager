import React, { useState } from 'react';

interface AddEngineFormProps {
  onAdd: (url: string, name: string) => void;
  onCancel: () => void;
}

const AddEngineForm: React.FC<AddEngineFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证输入
    if (!name.trim()) {
      setError('请输入搜索引擎名称');
      return;
    }
    
    if (!url.trim()) {
      setError('请输入搜索URL');
      return;
    }
    
    // 确保URL包含%s占位符
    if (!url.includes('%s')) {
      setError('URL必须包含%s作为搜索词占位符');
      return;
    }
    
    // 提交
    onAdd(url, name);
    
    // 重置表单
    setName('');
    setUrl('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-border rounded-md p-3 mb-3 space-y-3">
      <div className="space-y-1">
        <label htmlFor="engineName" className="block text-xs text-disabled font-medium">
          搜索引擎名称
        </label>
        <input
          type="text"
          id="engineName"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例如：Google"
          className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="engineUrl" className="block text-xs text-disabled font-medium">
          搜索URL（使用%s作为搜索词占位符）
        </label>
        <input
          type="text"
          id="engineUrl"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="例如：https://www.google.com/search?q=%s"
          className="w-full p-2 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        />
      </div>
      
      {error && <p className="text-red-500 text-xs">{error}</p>}
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm bg-transparent text-primary hover:bg-background-hover rounded-md"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm bg-primary text-white hover:bg-primary-hover rounded-md"
        >
          添加
        </button>
      </div>
    </form>
  );
};

export default AddEngineForm; 