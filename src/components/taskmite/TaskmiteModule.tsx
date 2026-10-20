import { useState } from 'react';
import { TaskmitePage } from './TaskmitePage';

export function TaskmiteModule() {
  const [currentView, setCurrentView] = useState<'list' | 'board'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);


  return (
    <div className="taskmite-module-container" style={{ padding: '0 8px' }}>
      <TaskmitePage
        currentView={currentView}
        onSelectView={setCurrentView}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

    </div>
  );
}

export default TaskmiteModule;
