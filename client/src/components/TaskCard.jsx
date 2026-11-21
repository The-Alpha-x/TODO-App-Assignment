import { useState } from "react";
import {
  PencilIcon,
  CheckIcon,
  RotateCcwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";

import { cn } from "../lib/utils";

import TaskFormModal from "../components/TaskFormModal";
import DeleteTaskDialog from "../components/DeleteTaskDialog";

import {
  markAsCompleted,
} from "../services/todoService";

import { toast } from "sonner";

export default function TaskCard({ todo, fetchTodos }) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Format creation date
  const created = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString()
    : "Recently";

  // Toggle task completion
  const handleToggleComplete = async () => {
    try {
      setIsUpdating(true);

      await markAsCompleted(todo._id);

      toast.success(
        todo.done ? "Task marked as pending." : "Task marked as completed!"
      );

      await fetchTodos();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="transition-opacity duration-300">
      <CardHeader className={cn("transition-opacity", todo.done && "opacity-50")}>

        <CardTitle className={cn(todo.done && "line-through")}>
          {todo.title}
        </CardTitle>

        {todo.description && (
          <CardDescription>
            {todo.description}
          </CardDescription>
        )}

        <CardAction className="flex gap-1">

          <TaskFormModal
            fetchTodos={fetchTodos}
            todo={todo}
            triggerProps={{
              variant: "outline",
              size: "icon-xs",
              "aria-label": "Edit task",
            }}
          >
            <PencilIcon />
          </TaskFormModal>

          <DeleteTaskDialog
            todo={todo}
            fetchTodos={fetchTodos}
          />

        </CardAction>
      </CardHeader>

      <CardFooter className="justify-between gap-2">

        <span className="text-xs text-muted-foreground">
          Added {created}
        </span>

        <Button
          variant={todo.done ? "outline" : "default"}
          size="xs"
          onClick={handleToggleComplete}
          disabled={isUpdating}
        >
          {todo.done ? <RotateCcwIcon /> : <CheckIcon />}

          {isUpdating
            ? "Updating..."
            : todo.done
              ? "Mark pending"
              : "Mark done"}
        </Button>

      </CardFooter>
    </Card>
  );
}