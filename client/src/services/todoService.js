import api from "./api";

// GET ALL TODOS
export const getAllTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};

// CREATE TODO
export const createTodo = async (todoData) => {
  const response = await api.post("/todos", todoData);
  return response.data;
};

// UPDATE TODO
export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

// MARK AS COMPLETED
export const markAsCompleted = async (id) => {
  const response = await api.patch(`/todos/${id}/done`);
  return response.data;
};

// DELETE TODO
export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};