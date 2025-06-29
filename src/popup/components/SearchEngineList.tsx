import React from 'react';
import { SearchEngines } from '@/shared/types';
import SearchEngineItem from './SearchEngineItem';

interface SearchEngineListProps {
  searchEngines: SearchEngines;
  engineOrder: string[];
  onToggle: (url: string, enabled: boolean) => void;
  onDelete: (url: string) => void;
}

const SearchEngineList: React.FC<SearchEngineListProps> = ({
  searchEngines,
  engineOrder,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
      {engineOrder.map((url) => {
        const engine = searchEngines[url];
        if (!engine) return null;
        
        return (
          <SearchEngineItem
            key={url}
            url={url}
            engine={engine}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        );
      })}
      
      {engineOrder.length === 0 && (
        <div className="text-center py-4 text-disabled text-sm">
          没有搜索引擎，请添加一个
        </div>
      )}
    </div>
  );
};

export default SearchEngineList; 