import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/task.types";

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, "_id">>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCard = ({ task, onUpdateTask, onDeleteTask }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "Task", task },
    disabled: isEditing,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    if (title.trim() && title !== task.title) {
      onUpdateTask(task._id, { title });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border border-blue-500 z-10 relative"
      >
        <textarea
          className="w-full bg-transparent border-none rounded-md resize-none focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 p-0"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl touch-none group relative"
    >
      <div
        onClick={() => setIsEditing(true)}
        className="flex-grow min-h-[40px] cursor-text"
      >
        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {task.title}
        </p>
      </div>

      <div className="absolute top-1 right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this task?")) {
              onDeleteTask(task._id);
            }
          }}
          className="stroke-gray-500 p-1 rounded-full hover:stroke-red-500"
          title="Delete Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>

        <div
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing"
          title="Drag Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 stroke-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;