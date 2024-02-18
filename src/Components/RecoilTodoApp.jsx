import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  editedTodoAtom,
  filterOptionAtom,
  filteredAndSortedTodosAtom,
  searchTermAtom,
  sortOrderAtom,
  todoReportAtom,
  todosAtom,
} from '../Atom/todoState';

const RecoilTodoApp = () => {
  const todos = useRecoilValue(todosAtom);
  const filteredAndSortedTodos = useRecoilValue(filteredAndSortedTodosAtom);
  const editedTodo = useRecoilValue(editedTodoAtom);

  return (
    <div className='max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Todo App</h1>

      <TodoInputComponent />

      {todos && todos.length ? (
        <>
          <TodoSearchComponent />
          <TodoFilterSortComponent />
        </>
      ) : (
        ''
      )}

      {todos && todos.length ? (
        <ul className='list-none p-0'>
          {filteredAndSortedTodos && filteredAndSortedTodos.length ? (
            filteredAndSortedTodos.map((todo) =>
              editedTodo?.id === todo.id ? (
                <EditTodoComponent key={todo.id} todo={todo} />
              ) : (
                <TodoComponent key={todo.id} todo={todo} />
              )
            )
          ) : (
            <ValidationComponent message={'No Record Found'} />
          )}
        </ul>
      ) : (
        ''
      )}
      {todos && todos.length ? <CountComponent /> : ''}
      {todos && todos.length ? (
        <RemoveAllComponent />
      ) : (
        <ValidationComponent message={'Todo Is Empty'} />
      )}
    </div>
  );
};

const TodoInputComponent = () => {
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useRecoilState(todosAtom);

  //   const todos = useRecoilValue(todosAtom);
  //   const setTodos = useSetRecoilState(todosAtom);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      const newTodoItem = {
        id: Math.random().toString(36).substring(7),
        task: newTodo,
        completed: false,
        createdDate: Date.now(),
        updatedDate: '',
        edited: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo('');
    }
  };

  return (
    <div className='flex mb-4'>
      <input
        type='text'
        placeholder='Add Todo'
        className='flex-grow p-2 mr-2 border border-gray-300 rounded'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={addTodo}>
        Add
      </button>
    </div>
  );
};

const TodoSearchComponent = () => {
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom);

  return (
    <div className='flex mb-4'>
      <input
        type='text'
        placeholder='Search Todo'
        className='flex-grow p-2 mr-2 border border-gray-300 rounded'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

const TodoFilterSortComponent = () => {
  const [filterOption, setFilterOption] = useRecoilState(filterOptionAtom);
  const [sortOrder, setSortOrder] = useRecoilState(sortOrderAtom);
  const setSearchTerm = useSetRecoilState(searchTermAtom);

  const resetFilters = () => {
    setFilterOption('all');
    setSortOrder('asc');
    setSearchTerm('');
  };

  return (
    <div className='flex gap-6 mb-4'>
      <div>
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className='border border-gray-300 rounded p-2'
        >
          <option value='all'>All</option>
          <option value='completed'>Completed</option>
          <option value='nonCompleted'>Non-Completed</option>
        </select>
      </div>

      <div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className='border border-gray-300 rounded p-2'
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </select>
      </div>

      <div className=''>
        <button className='bg-gray-500 text-white px-4 py-2 rounded' onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
};

const RemoveAllComponent = () => {
  const setTodos = useSetRecoilState(todosAtom);
  const removeAllTodos = () => {
    setTodos([]);
  };

  return (
    <div className='w-full flex justify-center'>
      <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={removeAllTodos}>
        Remove All
      </button>
    </div>
  );
};

const TodoComponent = ({ todo }) => {
  const [editedTodo, setEditedTodo] = useRecoilState(editedTodoAtom);
  const [todos, setTodos] = useRecoilState(todosAtom);

  const editTodo = (id) => {
    const editedData = todos.find((todo) => todo.id === id);
    setEditedTodo({ id: editedData.id, task: editedData.task });
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed, updatedDate: new Date() } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <li
      key={todo.id}
      className={`flex items-center justify-between p-2 mb-2 border border-gray-300 rounded ${
        editedTodo?.id === todo.id ? 'bg-gray-100' : todo.completed ? 'bg-green-100' : 'bg-red-100'
      }`}
    >
      <div className='flex flex-col'>
        <span className={todo.completed ? 'line-through' : ''}>{todo.task}</span>
        <span className='text-sm text-gray-500'>
          {new Date(todo.createdDate).toLocaleString()}
          {todo.edited ? ' (Edited)' : ''}
        </span>
      </div>
      <div className='flex'>
        <button className='text-blue-500 mr-2' onClick={() => toggleComplete(todo.id)}>
          {todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button className='text-yellow-500 mr-2' onClick={() => editTodo(todo.id)}>
          Edit
        </button>
        <button className='text-red-500' onClick={() => removeTodo(todo.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

const EditTodoComponent = ({ todo }) => {
  const [todos, setTodos] = useRecoilState(todosAtom);
  const [editedTodo, setEditedTodo] = useRecoilState(editedTodoAtom);

  const onChange = (e) => {
    setEditedTodo({
      id: editedTodo.id,
      task: e.target.value,
    });
  };

  const cancelEdit = () => {
    setEditedTodo({
      id: '',
      task: '',
    });
  };

  const updateEditTodo = () => {
    const { id, task } = editedTodo;
    if (task.trim() === '') {
      cancelEdit();
      return;
    }
    const updatedTodo = todos.map((item) =>
      item.id === id ? { ...item, task: task, updatedDate: Date.now(), edited: true } : item
    );
    setTodos(updatedTodo);
    cancelEdit();
  };

  return (
    <li
      key={todo.id}
      className={`flex items-center justify-between p-2 mb-2 border border-gray-300 rounded ${
        editedTodo?.id === todo.id ? 'bg-gray-100' : todo.completed ? 'bg-green-100' : 'bg-red-100'
      }`}
    >
      <input
        type='text'
        placeholder='Add Todo'
        className='flex-grow p-2 mr-2 border border-gray-300 rounded'
        value={editedTodo?.task}
        onChange={(e) => onChange(e)}
      />
      <button className='text-gray-500 mr-2' onClick={() => cancelEdit()}>
        Cancel
      </button>
      <button className='text-blue-500' onClick={() => updateEditTodo()}>
        Update
      </button>
    </li>
  );
};

const CountComponent = () => {
  const { totalTodos, completedCount, uncompletedCount, percentCompleted } =
    useRecoilValue(todoReportAtom);

  const cardClass = 'border border-gray-300 rounded p-2 text-center';

  return (
    <div className='flex gap-2 justify-around p-4'>
      <div className={`${cardClass} bg-gray-100`}>
        <p>Total</p>
        <p className='text-lg font-bold'>{totalTodos}</p>
      </div>
      <div className={`${cardClass} bg-green-50`}>
        <p>Completed</p>
        <p className='text-lg font-bold'>{completedCount}</p>
      </div>
      <div className={`${cardClass} bg-red-50`}>
        <p>Uncompleted</p>
        <p className='text-lg font-bold'>{uncompletedCount}</p>
      </div>
      <div className={`${cardClass} bg-green-50`}>
        <p>Completed</p>
        <p className='text-lg font-bold'>{percentCompleted}%</p>
      </div>
    </div>
  );
};

const ValidationComponent = ({ message }) => {
  return (
    <div
      className={`flex items-center justify-center p-2 mb-2 border border-gray-300 rounded bg-gray-200`}
    >
      {message}
    </div>
  );
};

export default RecoilTodoApp;
