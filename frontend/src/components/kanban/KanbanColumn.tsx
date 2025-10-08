
import { TaskCard } from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "../../types/task";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export const KanbanColumn = ({
  id,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const getColumnColor = (columnId: string) => {
    const colors = {
      todo: "border-blue-400 bg-blue-50",
      inProgress: "border-yellow-400 bg-yellow-50",
      completed: "border-green-400 bg-green-50",
    };
    return (
      colors[columnId as keyof typeof colors] || "border-gray-300 bg-gray-50"
    );
  };

  return (
    <div className="flex flex-col h-full rounded-lg shadow-md bg-white overflow-hidden transition-all duration-200">
      {/* Header */}
      <div
        className={`p-3 border-b-2 font-semibold text-lg text-gray-700 flex justify-between items-center ${getColumnColor(
          id
        )}`}
      >
        <span>{title}</span>
        <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-md shadow-sm">
          {tasks.length}
        </span>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto transition-all duration-200 ${
          isOver
            ? "bg-gray-100 border-2 border-dashed border-gray-400"
            : "bg-gray-50"
        }`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
