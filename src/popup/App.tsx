import React, { useEffect } from 'react';
import { APP_NAME, APP_VERSION } from '../shared/constants';
import AddEngineForm from './components/AddEngineForm';
import SearchEngineList from './components/SearchEngineList';
import { useSearchEngineStore } from './hooks/useSearchEngineStore';

const App: React.FC = () => {
  const { fetchEngines } = useSearchEngineStore();

  useEffect(() => {
    fetchEngines();
  }, [fetchEngines]);

  return (
    <div className="w-[550px] p-4 pb-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">{APP_NAME}</h1>
        <span className="text-xs text-gray-500">v{APP_VERSION}</span>
      </div>

      <div className="mb-3">
        <AddEngineForm />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">搜索引擎列表</h2>
        <SearchEngineList />
      </div>

      <div className="mt-5 pt-1 text-xs text-gray-500 text-center">
        点击搜索引擎可设为默认，右键选中文本可使用搜索引擎搜索
      </div>
    </div>
  );
};

export default App; 