import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useSearchEngineStore } from '../hooks/useSearchEngineStore';
import SearchEngineItem from './SearchEngineItem';
import { SearchEngine } from '../../shared/types';

interface SearchEngineListProps {
  onEdit: (engine: SearchEngine) => void;
}

const SearchEngineList: React.FC<SearchEngineListProps> = ({ onEdit }) => {
  const { engines, isLoading, error, fetchEngines, deleteEngine, reorderEngines } = useSearchEngineStore();
  const [enginesList, setEnginesList] = useState(engines);

  useEffect(() => {
    fetchEngines();
  }, [fetchEngines]);

  useEffect(() => {
    // 确保引擎列表按order排序
    const sortedEngines = [...engines].sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999;
      const orderB = b.order !== undefined ? b.order : 999;
      return orderA - orderB;
    });
    setEnginesList(sortedEngines);
  }, [engines]);

  const handleDelete = async (id: string) => {
    await deleteEngine(id);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(enginesList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setEnginesList(items);
    
    // 保存新的排序
    const engineIds = items.map(engine => engine.id);
    reorderEngines(engineIds);
  };

  if (isLoading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (enginesList.length === 0) {
    return <div className="text-center py-4">没有搜索引擎，请添加一个。</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="engines">
        {(provided) => (
          <div 
            className="space-y-2 max-h-[250px] overflow-y-auto pr-1"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {enginesList.map((engine, index) => (
              <Draggable key={engine.id} draggableId={engine.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <SearchEngineItem
                      engine={engine}
                      onDelete={handleDelete}
                      onEdit={onEdit}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SearchEngineList; 