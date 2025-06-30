import React, { useEffect, useState } from 'react';
import { APP_NAME, APP_VERSION } from '../shared/constants';
import AddEngineForm from './components/AddEngineForm';
import SearchEngineList from './components/SearchEngineList';
import ImportExport from './components/ImportExport';
import { useSearchEngineStore } from './hooks/useSearchEngineStore';
import { SearchEngine } from '../shared/types';

const App: React.FC = () => {
  const { fetchEngines } = useSearchEngineStore();
  const [engineToEdit, setEngineToEdit] = useState<SearchEngine | undefined>(undefined);

  useEffect(() => {
    fetchEngines();
  }, [fetchEngines]);

  const handleEditEngine = (engine: SearchEngine) => {
    setEngineToEdit(engine);
  };

  const handleCancelEdit = () => {
    setEngineToEdit(undefined);
  };

  return (
    <div className="w-[550px] p-4 pb-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
        <span className="text-xs text-gray-500">v{APP_VERSION}</span>
      </div>

      <div className="mb-3">
        <AddEngineForm 
          engineToEdit={engineToEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">搜索引擎列表</h2>
        <SearchEngineList onEdit={handleEditEngine} />
      </div>

      <ImportExport />

      <div className="mt-5 pt-1 text-xs text-gray-500 text-center">
        右键选中文本可使用搜索引擎搜索，拖拽可调整顺序
      </div>
    </div>
  );
};

export default App; 