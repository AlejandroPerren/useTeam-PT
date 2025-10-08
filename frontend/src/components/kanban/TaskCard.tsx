
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      todo: "Por hacer",
      inProgress: "En progreso",
      completed: "Completado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 select-none`}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-gray-400">#{task.id}</span>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-gray-500 hover:text-blue-500 transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="text-gray-500 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Título */}
      <h3 className="font-semibold text-gray-800 mb-2 break-words">
        {task.title}
      </h3>

      {/* Descripción */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-4 break-words">
          {task.description}
        </p>
      )}

      {/* Fecha y estado */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(task.createdAt)}</span>
        <span
          className={`px-2 py-1 rounded-md font-medium ${
            task.status === "completed"
              ? "bg-green-100 text-green-700"
              : task.status === "inProgress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>
    </div>
  );
};
