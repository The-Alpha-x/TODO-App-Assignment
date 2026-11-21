import * as taskService from '../services/taskService.js';

export const getAllTodos = async (req, res, next) => {
  try {
    res.status(200).json(await taskService.getAll());
  } catch (err) {
    next(err);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    res.status(201).json(await taskService.create(req.body));
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    res.status(200).json(await taskService.update(req.params.todoId, req.body));
  } catch (err) {
    next(err);
  }
};

export const markTodoAsCompleted = async (req, res, next) => {
  try {
    res.status(200).json(await taskService.completed(req.params.todoId));
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    res.status(200).json(await taskService.remove(req.params.todoId));
  } catch (err) {
    next(err);
  }
};
