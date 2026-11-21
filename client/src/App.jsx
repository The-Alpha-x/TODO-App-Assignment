
import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";

import AppShell from "./layouts/AppShell";
import TaskFormModal from "./components/TaskFormModal";
import TaskList from "@/components/TaskList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getAllTodos } from "@/services/todoService";

export default function App() {
  const [filter, setFilter] = useState("all");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);

      const todoData = await getAllTodos();

      setTodos(todoData || []);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const pendingCount = todos.filter((todo) => !todo.done).length;
  const completedCount = todos.filter((todo) => todo.done).length;

  return (
    <AppShell>
      <div className="flex flex-col gap-6">

        <div className="flex items-center justify-between">
          <h1 className="font-heading text-lg font-semibold tracking-wider uppercase">
            To-Do List
          </h1>

          <TaskFormModal fetchTodos={fetchTodos}>
            <PlusIcon size={18} />
            Add task
          </TaskFormModal>
        </div>

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="w-full">
            <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger value="done">Completed ({completedCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <p className="py-10 text-center text-muted-foreground">
            Loading tasks...
          </p>
        ) : (
          <TaskList filter={filter} todos={todos} fetchTodos={fetchTodos} />
        )}

      </div>

      <Toaster position="bottom-right" richColors />
    </AppShell>
  );
}
