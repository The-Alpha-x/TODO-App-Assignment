
import TaskCard from "@/components/TaskCard";

const emptyMessages = {
  all: "No tasks added yet.",
  pending: "No pending tasks yet.",
  done: "No completed tasks yet.",
};

export default function TaskList({ filter, todos = [], fetchTodos }) {
  // Filter tasks based on selected tab
  const filteredTodos = todos.filter((todo) => {
    if (filter === "pending") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  // Show empty state
  if (filteredTodos.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        {emptyMessages[filter] || emptyMessages.all}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {filteredTodos.map((todo) => (
        <TaskCard key={todo._id} todo={todo} fetchTodos={fetchTodos} />
      ))}
    </div>
  );
}
