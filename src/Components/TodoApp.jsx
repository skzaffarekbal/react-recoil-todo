import React, { useEffect, useMemo, useState } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('normalTodo')) || []);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editedTodo, setEditedTodo] = useState({ id: '', task: '' });

  useEffect(() => {
    localStorage.setItem('normalTodo', JSON.stringify(todos));
  }, [todos]);

  const onChange = (value, field) => {
    if (field === 'newTodo') setNewTodo(value);
    else if (field === 'searchTerm') setSearchTerm(value);
    else if (field === 'filterOption') setFilterOption(value);
    else if (field === 'sortOrder') setSortOrder(value);
  };

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

  const removeAllTodos = () => {
    setTodos([]);
  };

  const editTodo = (id) => {
    console.log(`Edit todo with id: ${id}`);
    const editTodo = todos.find((todo) => todo.id === id);
    setEditedTodo({
      id: editTodo?.id,
      task: editTodo?.task,
    });
  };

  const cancelEdit = () =>
    setEditedTodo({
      id: '',
      task: '',
    });

  const setEditTodo = (e) => {
    setEditedTodo((state) => ({
      ...state,
      task: e.target.value,
    }));
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

  const resetFilters = () => {
    setFilterOption('all');
    setSortOrder('asc');
    setSearchTerm('');
  };

  const filteredAndSortedTodos = useMemo(() => {
    return todos
      ?.filter((todo) => {
        if (filterOption === 'all') return true;
        return filterOption === 'completed' ? todo.completed : !todo.completed;
      })
      ?.filter((todo) => todo.task.toLowerCase().includes(searchTerm.toLowerCase()))
      ?.sort((a, b) => {
        const sortOrderFactor = sortOrder === 'asc' ? 1 : -1;
        return sortOrderFactor * (a.createdDate - b.createdDate);
      });
  }, [todos, filterOption, searchTerm, sortOrder]);

  return (
    <div className='max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Todo App</h1>

      <TodoInputComponent newTodo={newTodo} onChange={onChange} addTodo={addTodo} />

      {todos && todos.length ? (
        <>
          <TodoSearchComponent searchTerm={searchTerm} onChange={onChange} />
          <TodoFilterSortComponent
            filterOption={filterOption}
            sortOrder={sortOrder}
            onChange={onChange}
            resetFilters={resetFilters}
          />
        </>
      ) : (
        ''
      )}

      {todos && todos.length ? (
        <ul className='list-none p-0'>
          {filteredAndSortedTodos && filteredAndSortedTodos.length ? (
            filteredAndSortedTodos.map((todo) =>
              editedTodo?.id === todo.id ? (
                <EditTodoComponent
                  key={todo.id}
                  todo={todo}
                  editedTodo={editedTodo}
                  setEditTodo={setEditTodo}
                  cancelEdit={cancelEdit}
                  updateEditTodo={updateEditTodo}
                />
              ) : (
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  editedTodo={editedTodo}
                  toggleComplete={toggleComplete}
                  editTodo={editTodo}
                  removeTodo={removeTodo}
                />
              )
            )
          ) : (
            <ValidationComponent message={'No Record Found'} />
          )}
        </ul>
      ) : (
        ''
      )}
      {todos && todos.length ? <CountComponent todos={todos} /> : ''}
      {todos && todos.length ? (
        <RemoveAllComponent removeAllTodos={removeAllTodos} />
      ) : (
        <ValidationComponent message={'Todo Is Empty'} />
      )}
    </div>
  );
};

const CountComponent = ({ todos }) => {
  const totalTodos = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const uncompletedCount = totalTodos - completedCount;
  const percentCompleted =
    totalTodos !== 0
      ? Number.isInteger((completedCount / totalTodos) * 100)
        ? (completedCount / totalTodos) * 100
        : ((completedCount / totalTodos) * 100).toFixed(2)
      : 0;

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

const TodoInputComponent = ({ newTodo, onChange, addTodo }) => {
  return (
    <div className='flex mb-4'>
      <input
        type='text'
        placeholder='Add Todo'
        className='flex-grow p-2 mr-2 border border-gray-300 rounded'
        value={newTodo}
        onChange={(e) => onChange(e.target.value, 'newTodo')}
      />
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={addTodo}>
        Add
      </button>
    </div>
  );
};

const TodoSearchComponent = ({ searchTerm, onChange }) => {
  return (
    <div className='flex mb-4'>
      <input
        type='text'
        placeholder='Search Todo'
        className='flex-grow p-2 mr-2 border border-gray-300 rounded'
        value={searchTerm}
        onChange={(e) => onChange(e.target.value, 'searchTerm')}
      />
    </div>
  );
};

const TodoFilterSortComponent = ({ filterOption, sortOrder, onChange, resetFilters }) => {
  return (
    <div className='flex gap-6 mb-4'>
      <div>
        <select
          value={filterOption}
          onChange={(e) => onChange(e.target.value, 'filterOption')}
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
          onChange={(e) => onChange(e.target.value, 'sortOrder')}
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

const RemoveAllComponent = ({ removeAllTodos }) => {
  return (
    <div className='w-full flex justify-center'>
      <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={removeAllTodos}>
        Remove All
      </button>
    </div>
  );
};

const TodoComponent = ({ todo, editedTodo, toggleComplete, editTodo, removeTodo }) => {
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

const EditTodoComponent = ({ todo, editedTodo, setEditTodo, cancelEdit, updateEditTodo }) => {
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
        onChange={(e) => setEditTodo(e)}
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

const ValidationComponent = ({ message }) => {
  return (
    <div
      className={`flex items-center justify-center p-2 mb-2 border border-gray-300 rounded bg-gray-200`}
    >
      {message}
    </div>
  );
};

export default TodoApp;
