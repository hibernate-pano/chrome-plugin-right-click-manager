import React, { useEffect } from 'react';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';
import SearchEngineItem from './SearchEngineItem';

const SearchEngineList: React.FC = () => {
  const { engines, isLoading, error, fetchEngines, deleteEngine, setDefaultEngine } = useSearchEngineStore();

  useEffect(() => {
    fetchEngines();
  }, [fetchEngines]);

  const handleDelete = async (id: string) => {
    await deleteEngine(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultEngine(id);
  };

  if (isLoading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (engines.length === 0) {
    return <div className="text-center py-4">没有搜索引擎，请添加一个。</div>;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {engines.map((engine) => (
        <SearchEngineItem
          key={engine.id}
          engine={engine}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      ))}
    </div>
  );
};

export default SearchEngineList; 