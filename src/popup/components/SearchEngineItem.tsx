import React from 'react';
import { SearchEngine } from '@/shared/types';

interface SearchEngineItemProps {
  url: string;
  engine: SearchEngine;
  onToggle: (url: string, enabled: boolean) => void;
  onDelete: (url: string) => void;
}

const SearchEngineItem: React.FC<SearchEngineItemProps> = ({
  url,
  engine,
  onToggle,
  onDelete,
}) => {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(url, e.target.checked);
  };

  const handleDelete = () => {
    if (window.confirm(`确定要删除 ${engine.name} 吗？`)) {
      onDelete(url);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 hover:bg-background-hover rounded-md transition-all">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={engine.enabled}
          onChange={handleToggle}
          className="w-4 h-4 border-border rounded focus:ring-primary mr-2"
        />
        <label className="text-sm cursor-pointer select-none">{engine.name}</label>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleDelete}
          className="text-xs text-gray-500 hover:text-red-500 p-1"
          title="删除"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchEngineItem; 