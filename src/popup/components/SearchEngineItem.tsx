import React from 'react';
import { SearchEngine } from '../../shared/types';

interface SearchEngineItemProps {
  engine: SearchEngine;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const SearchEngineItem: React.FC<SearchEngineItemProps> = ({
  engine,
  onDelete,
  onSetDefault
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定要删除 ${engine.name} 吗？`)) {
      onDelete(engine.id);
    }
  };

  const handleSetDefault = () => {
    if (!engine.isDefault) {
      onSetDefault(engine.id);
    }
  };

  return (
    <div 
      className={`flex items-center p-2 rounded-lg ${
        engine.isDefault 
          ? 'bg-blue-100 border border-blue-300' 
          : 'bg-white border hover:bg-gray-50'
      }`}
      onClick={handleSetDefault}
    >
      <div className="flex-shrink-0 mr-2">
        <img 
          src={engine.icon} 
          alt={`${engine.name} icon`} 
          className="w-5 h-5"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=' + new URL(engine.url).hostname;
          }}
        />
      </div>
      <div className="flex-grow min-w-0 mr-2">
        <div className="font-medium">{engine.name}</div>
        <div className="text-xs text-gray-500 truncate w-full" title={engine.url}>
          {engine.url}
        </div>
      </div>
      <div className="flex items-center flex-shrink-0">
        {engine.isDefault && (
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded mr-1">
            默认
          </span>
        )}
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
          title="删除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchEngineItem; 