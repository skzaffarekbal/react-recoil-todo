import { atom, selector } from 'recoil';

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    } else {
      setSelf([]);
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  
const todosAtom = atom({
  key: 'todosAtom',
  default: [],
  effects: [localStorageEffect('recoil_todo')],
});

const filterOptionAtom = atom({
  key: 'filterOptionAtom',
  default: 'all',
});

const sortOrderAtom = atom({
  key: 'sortOrderAtom',
  default: 'asc',
});

const searchTermAtom = atom({
  key: 'searchTermAtom',
  default: '',
});

const editedTodoAtom = atom({
  key: 'editedTodoAtom',
  default: { id: '', task: '' },
});

const filteredAndSortedTodosAtom = selector({
  key: 'filteredAndSortedTodosAtom',
  get: ({ get }) => {
    const todos = get(todosAtom);
    const filterOption = get(filterOptionAtom);
    const sortOrder = get(sortOrderAtom);
    const searchTerm = get(searchTermAtom);

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
  },
});

const todoReportAtom = selector({
  key: 'todoReportAtom',
  get: ({ get }) => {
    const todos = get(todosAtom);

    const totalTodos = todos.length;
    const completedCount = todos.filter((todo) => todo.completed).length;
    const uncompletedCount = totalTodos - completedCount;
    const percentCompleted =
      totalTodos !== 0
        ? Number.isInteger((completedCount / totalTodos) * 100)
          ? (completedCount / totalTodos) * 100
          : ((completedCount / totalTodos) * 100).toFixed(2)
        : 0;

    return {
      totalTodos,
      completedCount,
      uncompletedCount,
      percentCompleted,
    };
  },
});

export {
  todosAtom,
  filterOptionAtom,
  sortOrderAtom,
  editedTodoAtom,
  searchTermAtom,
  filteredAndSortedTodosAtom,
  todoReportAtom,
};
