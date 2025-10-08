import { useEffect, useState, useMemo } from "react";
import { type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import type { Column } from "../types/column.types";
import type { Task } from "../types/task.types";
import { connectSocket } from "../network/utils/SocketIo";

export const useKanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasksOrderInColumn, setTasksOrderInColumn] = useState<Record<string, string[]>>({});

  const boardId = localStorage.getItem("selectedBoard") || "";
  const columnsId = useMemo(() => columns.map((col) => col._id), [columns]);

  const normalizeColumn = (col: Column): Column => ({
    _id: col._id,
    title: col.title,
    order: col.order,
    boardId: col.boardId,
  });

  useEffect(() => {
    connectSocket.emit("joinBoard", boardId);

    connectSocket.on("on-columns-initial", (cols) => setColumns(cols.map(normalizeColumn)));
    connectSocket.on("on-column-created", (col) => setColumns((prev) => [...prev, normalizeColumn(col)]));
    connectSocket.on("on-column-updated", (col) =>
      setColumns((prev) => prev.map((c) => (c._id === col._id ? normalizeColumn(col) : c)))
    );
    connectSocket.on("on-column-deleted", (col) => setColumns((prev) => prev.filter((c) => c._id !== col._id)));
    connectSocket.on("on-columns-reordered", (cols) => setColumns(cols.map(normalizeColumn)));

    connectSocket.on("on-tasks-initial", (serverTasks) => {
      setTasks(serverTasks);
    });

    connectSocket.on("on-task-created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    connectSocket.on("on-task-updated", (updated) => {
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });

    connectSocket.on("on-task-deleted", (deleted) => {
      setTasks((prev) => prev.filter((t) => t._id !== deleted._id));
    });

    connectSocket.on("on-task-order-changed", ({ columnId, taskId, newOrder }) => {
      setTasks((prev) => {
        const filtered = prev.filter((t) => t._id !== taskId);
        const movedTask = prev.find((t) => t._id === taskId);
        if (!movedTask) return prev;

        const columnTasks = filtered.filter((t) => t.columnId === columnId);
        columnTasks.splice(newOrder, 0, movedTask);
        const otherTasks = filtered.filter((t) => t.columnId !== columnId);

        return [...otherTasks, ...columnTasks];
      });
    });

    return () => {
      connectSocket.off("on-columns-initial");
      connectSocket.off("on-column-created");
      connectSocket.off("on-column-updated");
      connectSocket.off("on-column-deleted");
      connectSocket.off("on-columns-reordered");
      connectSocket.off("on-tasks-initial");
      connectSocket.off("on-task-created");
      connectSocket.off("on-task-updated");
      connectSocket.off("on-task-deleted");
      connectSocket.off("on-task-order-changed");
    };
  }, [boardId]);

  const handleTasksOrderChange = (columnId: string, taskIds: string[]) => {
    setTasksOrderInColumn((prev) => ({ ...prev, [columnId]: taskIds }));
  };

  const handleCreateColumn = () => {
    connectSocket.emit("createColumn", {
      title: `Nueva columna ${columns.length + 1}`,
      boardId,
      order: columns.length,
    });
  };

  const handleDeleteColumn = (columnId: string) => {
    connectSocket.emit("deleteColumn", { id: columnId, boardId });
  };

  const handleDeleteTask = (taskId: string) => {
    connectSocket.emit("deleteTask", { id: taskId, boardId });
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);

    if (!active || !over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "Column" && overType === "Column") {
      const oldIndex = columns.findIndex((col) => col._id === active.id);
      const newIndex = columns.findIndex((col) => col._id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const updated = [...columns];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      setColumns(updated);

      connectSocket.emit("changeColumnOrder", {
        columnId: active.id,
        newOrder: newIndex,
      });
    }

    if (activeType === "Task" && (overType === "Task" || overType === "Column")) {
      const activeTask = active.data.current.task;
      const overTask = over.data.current?.task;
      const toColumnId = overTask?.columnId || over.id;
      const fromColumnId = activeTask.columnId;

      if (fromColumnId !== toColumnId) {
        connectSocket.emit("updateTask", {
          id: activeTask._id,
          updates: {
            columnId: toColumnId,
            editadoPor: "Alejandro",
          },
          boardId,
        });
      } else {
        const taskIds = tasksOrderInColumn[toColumnId];
        const newIndex = taskIds?.indexOf(over.id) ?? 0;

        connectSocket.emit("changeTaskOrder", {
          taskId: activeTask._id,
          columnId: toColumnId,
          newOrder: newIndex,
        });
      }
    }
  };

  return {
    boardId,
    columns,
    columnsId,
    tasks,
    activeColumn,
    activeTask,
    onDragStart,
    onDragEnd,
    handleCreateColumn,
    handleDeleteColumn,
    handleTasksOrderChange,
    handleDeleteTask,
  };
};
