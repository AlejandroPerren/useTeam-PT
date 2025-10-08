import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaPlus } from "react-icons/fa";
import type { Column } from "../../types/column.types";
import type { Task } from "../../types/task.types";
import TaskCard from "../Tasks/TaskCard";

interface Props {
  column: Column;
  tasks: Task[];
  onDeleteColumn: (columnId: string) => void;
  onCreateTask: (columnId: string, title: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, "_id">>) => void;
  onDeleteTask: (taskId: string) => void;
}

const ColumnContainer = ({
  column,
  tasks,
  onDeleteColumn,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { type: "Column", column },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
  };

  const handleAddTask = () => {
    const taskTitle = prompt("Titulo de la tarea:");
    if (taskTitle) {
      onCreateTask(column._id, taskTitle);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[350px] h-[500px] max-h-[500px] rounded-lg bg-gray-100 dark:bg-gray-800/80 flex flex-col shadow-md"
    >
      {/* Column Header */}
      <div className="bg-gray-200 dark:bg-gray-900 text-md font-bold text-gray-800 dark:text-gray-200 p-3 h-[60px] rounded-t-lg border-b-2 border-gray-300 dark:border-gray-700 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 bg-gray-300 dark:bg-gray-700 rounded-full px-2 py-1 text-sm">
            {tasks.length}
          </span>
          {column.title}
        </div>
        <button
          onClick={() => onDeleteColumn(column._id)}
          className="stroke-gray-500 hover:stroke-red-500 hover:bg-gray-300 dark:hover:bg-gray-700 rounded px-1 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>

      {/* Task List */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column Footer / Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="h-[40px] bg-gray-200 dark:bg-gray-900 rounded-b-lg flex items-center justify-center text-gray-400 text-sm cursor-grab active:cursor-grabbing select-none mt-auto"
      >
        Arrastrar columna
      </div>

      {/* Add task button */}
      <button
        className="flex gap-2 items-center border-2 rounded-md p-4 border-gray-300 dark:border-gray-700 border-dashed hover:bg-gray-200 dark:hover:bg-gray-900 hover:text-blue-500 text-gray-500 m-2"
        onClick={handleAddTask}
      >
        <FaPlus />
        Añadir Tarea
      </button>
    </div>
  );
};

export default ColumnContainer;