
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner"
import * as z from "zod";

import { createTodo, updateTodo } from "../services/todoService";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required."),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters."),
});

export default function TaskFormModal({
  fetchTodos,
  todo,
  children,
  triggerProps,
}) {
  const isEdit = !!todo;

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const descriptionLength = watch("description")?.length ?? 0;

  // Reset form when opening or changing the selected task
  useEffect(() => {
    if (open) {
      reset({
        title: todo?.title ?? "",
        description: todo?.description ?? "",
      });
    }
  }, [open, todo, reset]);

  const handleOpenChange = (next) => {
    setOpen(next);

    if (!next) {
      reset({
        title: "",
        description: "",
      });
    }
  };

  // Submit form
  const onSubmit = async (values) => {
  try {
    setIsSubmitting(true);

    if (isEdit) {
      await updateTodo(todo._id, {
        title: values.title,
        description: values.description,
      });

      toast.success("Task updated successfully!");
    } else {
      await createTodo({
        title: values.title,
        description: values.description,
      });

      toast.success("Task created successfully!");
    }

    reset();
    setOpen(false);

    await fetchTodos();
  } catch (error) {
    console.error("Failed to save task:", error);

    toast.error(
      error.response?.data?.message || "Something went wrong."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button {...triggerProps} />}>
        {children}
      </DialogTrigger>

      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6"
        >
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit task" : "New task"}
            </DialogTitle>

            <DialogDescription>
              {isEdit
                ? "Change anything you like."
                : "What do you need to get done?"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-1">
            <label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Title
            </label>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="e.g. Complete the project"
                  autoFocus
                  aria-invalid={!!errors.title}
                />
              )}
            />

            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              Description{" "}
              <span className="font-normal normal-case text-muted-foreground">
                (optional)
              </span>
            </label>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Any descriptive details..."
                  aria-invalid={!!errors.description}
                />
              )}
            />

            <div className="flex justify-between text-xs">
              {errors.description ? (
                <span className="text-destructive">
                  {errors.description.message}
                </span>
              ) : (
                <span />
              )}

              <span className="text-muted-foreground">
                {descriptionLength}/500
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Save task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
