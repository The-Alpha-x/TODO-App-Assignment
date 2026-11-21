import { Router } from "express";
import { createTodo, deleteTodo, getAllTodos, updateTodo, markTodoAsCompleted } from "../controllers/taskController.js";

const router = Router();
router.get("/", getAllTodos);
router.post("/", createTodo);
router.put("/:todoId", updateTodo);
router.patch("/:todoId/done", markTodoAsCompleted);
router.delete("/:todoId", deleteTodo);
export default router;
