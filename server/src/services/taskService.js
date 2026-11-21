import mongoose from 'mongoose';
import Task from '../models/Task.js';

export const getAll = async () => Task.find().lean();

export const create = async ({ title, description }) => {
  if (!title) {
    const err = new Error('title is required');
    err.status = 400;
    throw err;
  }
  return Task.create({ title, description });
};

export const getById = async (id) => {
  const task = mongoose.isValidObjectId(id) ? await Task.findById(id) : null;
  if (!task) {
    const err = new Error('Todo not found');
    err.status = 404;
    throw err;
  }
  return task;
};

export const update = async (id, { title, description }) => {
  const task = await getById(id);
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  return await task.save();
};

export const completed = async (id) => {
  const task = await getById(id);

  task.done = !task.done;

  return await task.save();
};

export const remove = async (id) => {
  const task = await getById(id);
  await task.deleteOne();
  return await task;
};
