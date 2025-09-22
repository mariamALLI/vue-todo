const TODOS_KEY = "todos";

export type Todo = {
  id: number;
  todo: string;
  completed: boolean;
};

export const getTodosFromLocalStorage = (): Todo[] => {
  const savedTodos: Todo[] = JSON.parse(localStorage.getItem(TODOS_KEY) || "[]");
  return savedTodos || [];
};

export const saveTodosToLocalStorage = (todos: Todo[]) => {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
};

export interface UpdateTodo {
  todo?: string;
  completed?: boolean;
}

export const updateTodoInLocalStorage = (
  id: number,
  updatedTodo: UpdateTodo
): Todo[] => {
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, ...updatedTodo } : todo
  );
  saveTodosToLocalStorage(updatedTodos);
  return updatedTodos;
};
