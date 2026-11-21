import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteTodo } from "@/services/todoService";
import { toast } from "sonner";

export default function DeleteTaskDialog({ todo, fetchTodos }) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
  try {
    await deleteTodo(todo._id);

    toast.success("Task deleted successfully!");

    await fetchTodos();
  } catch (error) {
    toast.error("Failed to delete task.");
  } finally {
    setOpen(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="destructive" size="icon-xs" aria-label="Delete task" />}
      >
        <Trash2Icon />
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete task?</DialogTitle>
          <DialogDescription>
            "{todo.title}" will be deleted. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive" onClick={() => handleDelete()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
