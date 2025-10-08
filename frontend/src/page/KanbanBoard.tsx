import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

import ColumnContainer from "../components/Columns/ColumnContainer";
import TaskCard from "../components/Tasks/TaskCard";
import { useKanbanBoard } from "../hooks/useKanbanBoard";

const KanbanBoard = () => {
  const {
    boardId,
    columns,
    columnsId,
    tasks,
    activeTask,
    onDragStart,
    onDragEnd,
    handleCreateColumn,
    handleDeleteColumn,
    handleTasksOrderChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  } = useKanbanBoard();

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Contenedor principal del board */}
      <div className="flex items-start justify-start gap-6 overflow-x-auto overflow-y-hidden px-10 py-8">
        <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col._id}
                column={col}
                tasks={tasks.filter((t) => t.columnId === col._id)}
                onDeleteColumn={handleDeleteColumn}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </SortableContext>

          {/* Botón de agregar columna */}
          <button
            onClick={handleCreateColumn}
            className="h-[60px] w-[350px] min-w-[350px] flex items-center justify-center text-lg font-semibold rounded-xl bg-white/80 border border-gray-300 shadow-sm hover:shadow-lg hover:scale-105 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          >
            + Agregar columna
          </button>

          {/* Efecto al arrastrar tareas */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 opacity-90 scale-105">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="flex justify-center pb-8">
        <button
          onClick={async () => {
            try {
              const response = await fetch("http://localhost:3000/export", {
                method: "POST",
              });
              if (!response.ok) throw new Error("Error al generar el archivo");
              alert("✅ Archivo generado y enviado correctamente por mail");
            } catch (err) {
              alert("❌ Error al exportar: " + err.message);
            }
          }}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md font-semibold transition-all hover:scale-105"
        >
          📤 Exportar y Enviar Archivo
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
