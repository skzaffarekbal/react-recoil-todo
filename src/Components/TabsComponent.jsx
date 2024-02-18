import React, { useState } from 'react';
import TodoApp from './TodoApp';
import { RecoilRoot } from 'recoil';
import RecoilTodoApp from './RecoilTodoApp';

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState('normalTodo');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='max-w-lg mx-auto mt-8 mb-8 p-4 border border-gray-300 rounded'>
      <div className='flex justify-between mb-4'>
        <div
          className={`cursor-pointer py-2 px-4 border-b-2 ${
            activeTab === 'normalTodo' ? 'border-blue-500' : ''
          }`}
          onClick={() => handleTabClick('normalTodo')}
        >
          Normal Todo
        </div>
        <div
          className={`cursor-pointer py-2 px-4 border-b-2 ${
            activeTab === 'recoilTodo' ? 'border-blue-500' : ''
          }`}
          onClick={() => handleTabClick('recoilTodo')}
        >
          Recoil Todo
        </div>
      </div>

      <div className='tab-content'>
        {activeTab === 'normalTodo' && (
          <div>
            <h2 className='text-xl font-bold mb-4'>Normal Todo Using State</h2>
            <TodoApp />
          </div>
        )}

        {activeTab === 'recoilTodo' && (
          <div>
            <h2 className='text-xl font-bold mb-4'>Todo App Using Recoil</h2>
            <RecoilRoot>
              <RecoilTodoApp />
            </RecoilRoot>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;
