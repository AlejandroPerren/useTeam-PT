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
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] gap-4 bg-gray-50 dark:bg-gray-900/90">
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

        <button
          onClick={handleCreateColumn}
          className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-gray-800 border-2 border-gray-950 ring-rose-500 hover:ring-2 self-start mt-4"
        >
          + Agregar columna
        </button>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-90">
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
  );
};

export default KanbanBoard;