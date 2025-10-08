import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { useState } from "react";

import type { Column } from "../../types/column.types";
import type { CreateTaskBody, Task } from "../../types/task.types";

import { connectSocket } from "../../network/utils/SocketIo";
import TaskCard from "../Tasks/TaskCard";
import DropdownModal from "../ui/DropDownModal";
import { TaskForm } from "../Tasks/TaskForm";

interface Props {
  column: Column;
  boardId: string;
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onTasksOrderChange?: (columnId: string, taskIds: string[]) => void;
}

const ColumnContainer = ({
  column,
  boardId,
  tasks,
  onDeleteColumn,
  onTasksOrderChange,
  onDeleteTask,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column._id,
      data: { type: "Column", column },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleCreateTask = (data: CreateTaskBody) => {
    connectSocket.emit("createTask", {
      ...data,
      boardId,
      columnId: column._id,
      creadoPor: "Alejandro", // Hardcoded for now
    });
    setModalOpen(false);
  };

  const handleDeleteColumn = () => {
    if (onDeleteColumn) onDeleteColumn(column._id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col p-1"
    >
      {/* Header */}
      <div className="text-md bg-gray-950 h-[60px] text-white rounded-t-md border-gray-800 border-2 flex items-center justify-between px-2">
        <div className="flex gap-2 items-center">
          <span className="flex justify-center items-center bg-gray-900 text-sm rounded-full px-2">
            {tasks.length}
          </span>
          {column.title}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="hover:text-green-500 text-white"
          >
            <FaPlus />
          </button>
          <button
            onClick={handleDeleteColumn}
            className="hover:text-red-500 text-white"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col flex-grow gap-2 overflow-y-auto mt-2 px-1">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => {
                  // Si se necesita lógica de edición, se puede implementar aquí.
                }}
                onDelete={() => onDeleteTask(task._id)}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Column drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="h-[40px] bg-gray-900 rounded-b-md flex items-center justify-center text-gray-400 text-sm cursor-grab active:cursor-grabbing select-none"
      >
        {column._id}
      </div>

      {/* Modal para nueva tarea */}
      <DropdownModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <TaskForm
          onSubmit={handleCreateTask}
          boardId={boardId}
          columnId={column._id}
        />
      </DropdownModal>
    </div>
  );
};

export default ColumnContainer;
