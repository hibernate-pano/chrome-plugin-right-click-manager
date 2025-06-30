import React from 'react';
import { SearchEngine } from '../../shared/types';

interface SearchEngineItemProps {
  engine: SearchEngine;
  onDelete: (id: string) => void;
  onEdit: (engine: SearchEngine) => void;
}

const SearchEngineItem: React.FC<SearchEngineItemProps> = ({
  engine,
  onDelete,
  onEdit
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定要删除 ${engine.name} 吗？`)) {
      onDelete(engine.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(engine);
  };

  return (
    <div className="flex items-center p-2 rounded-lg bg-white border hover:bg-gray-50">
      <div className="flex-shrink-0 mr-2 text-gray-400 cursor-move">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
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
      <div className="flex items-center flex-shrink-0 space-x-2">
        <button
          onClick={handleEdit}
          className="text-blue-500 hover:text-blue-700 flex-shrink-0"
          title="编辑"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
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