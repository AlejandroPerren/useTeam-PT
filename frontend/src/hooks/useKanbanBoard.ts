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
  const [tasksOrderInColumn, setTasksOrderInColumn] = useState<
    Record<string, string[]>
  >({});

  const boardId = localStorage.getItem("selectedBoard") || "";
  const userName = localStorage.getItem("userName") || "Usuario";
  const columnsId = useMemo(() => columns.map((col) => col._id), [columns]);

  const normalizeColumn = (col: Column): Column => ({
    _id: col._id,
    title: col.title,
    order: col.order,
    boardId: col.boardId,
  });

  useEffect(() => {
    connectSocket.emit("joinBoard", boardId);

    const handleColumnsInitial = (cols: Column[]) => setColumns(cols.map(normalizeColumn));
    const handleColumnCreated = (col: Column) => setColumns((prev) => [...prev, normalizeColumn(col)]);
    const handleColumnUpdated = (col: Column) => setColumns((prev) => prev.map((c) => (c._id === col._id ? normalizeColumn(col) : c)));
    const handleColumnDeleted = (col: Column) => setColumns((prev) => prev.filter((c) => c._id !== col._id));
    const handleColumnsReordered = (cols: Column[]) => setColumns(cols.map(normalizeColumn));

    const handleTasksInitial = (serverTasks: Task[]) => setTasks(serverTasks);
    const handleTaskCreated = (newTask: Task) => setTasks((prev) => [...prev, newTask]);
    const handleTaskUpdated = (updatedTask: Task) => setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
    const handleTaskDeleted = (deletedTask: { _id: string }) => setTasks((prev) => prev.filter((task) => task._id !== deletedTask._id));

    connectSocket.on("on-columns-initial", handleColumnsInitial);
    connectSocket.on("on-column-created", handleColumnCreated);
    connectSocket.on("on-column-updated", handleColumnUpdated);
    connectSocket.on("on-column-deleted", handleColumnDeleted);
    connectSocket.on("on-columns-reordered", handleColumnsReordered);

    connectSocket.on("on-tasks-initial", handleTasksInitial);
    connectSocket.on("on-task-created", handleTaskCreated);
    connectSocket.on("on-task-updated", handleTaskUpdated);
    connectSocket.on("on-task-deleted", handleTaskDeleted);

    connectSocket.on("on-task-order-changed", ({ columnId, taskId, newOrder }) => {
      setTasks((prevTasks) => {
        const taskToMove = prevTasks.find((t) => t._id === taskId);
        if (!taskToMove) return prevTasks;

        const remainingTasks = prevTasks.filter((t) => t._id !== taskId);

        const columnTasks = remainingTasks.filter((t) => t.columnId === columnId);

        columnTasks.splice(newOrder, 0, taskToMove);

        const otherColumnTasks = remainingTasks.filter(
          (t) => t.columnId !== columnId
        );

        return [...otherColumnTasks, ...columnTasks];
      });
    });

    return () => {
      connectSocket.off("on-columns-initial", handleColumnsInitial);
      connectSocket.off("on-column-created", handleColumnCreated);
      connectSocket.off("on-column-updated", handleColumnUpdated);
      connectSocket.off("on-column-deleted", handleColumnDeleted);
      connectSocket.off("on-columns-reordered", handleColumnsReordered);

      connectSocket.off("on-tasks-initial", handleTasksInitial);
      connectSocket.off("on-task-created", handleTaskCreated);
      connectSocket.off("on-task-updated", handleTaskUpdated);
      connectSocket.off("on-task-deleted", handleTaskDeleted);
      connectSocket.off("on-task-order-changed", handleTasksInitial);
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

  const handleCreateTask = (columnId: string, title: string) => {
    if (!title.trim()) return;
    connectSocket.emit("createTask", {
      title,
      columnId,
      boardId,
      creadoPor: userName,
    });
  };

  const handleUpdateTask = (
    taskId: string,
    updates: Partial<Omit<Task, "_id">>
  ) => {
    connectSocket.emit("updateTask", {
      id: taskId,
      updates: { ...updates, editadoPor: userName },
      boardId,
    });
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
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((prev) => {
        const activeColumnIndex = prev.findIndex((col) => col._id === activeId);
        const overColumnIndex = prev.findIndex((col) => col._id === overId);

        const reordered = [...prev];
        const [moved] = reordered.splice(activeColumnIndex, 1);
        reordered.splice(overColumnIndex, 0, moved);

        connectSocket.emit("changeColumnOrder", {
          boardId,
          columnId: activeId,
          newOrder: overColumnIndex,
        });

        return reordered;
      });
      return;
    }

    const isActiveATask = active.data.current?.type === "Task";
    if (isActiveATask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t._id === activeId);
        const overIndex = prev.findIndex((t) => t._id === overId);
        const activeTask = prev[activeIndex];

        if (!activeTask) return prev;

        const toColumnId =
          over.data.current?.type === "Column"
            ? overId
            : prev[overIndex]?.columnId;

        if (!toColumnId) return prev;

        const fromColumnId = activeTask.columnId;
        const reorderedTasks = [...prev];
        const [movedTask] = reorderedTasks.splice(activeIndex, 1);
        const finalTask = { ...movedTask, columnId: toColumnId };

        const finalOverIndex = reorderedTasks.findIndex((t) => t._id === overId);

        if (finalOverIndex !== -1) {
          reorderedTasks.splice(finalOverIndex, 0, finalTask);
        } else {
          const lastTaskIndexInColumn = reorderedTasks
            .map((t) => t.columnId)
            .lastIndexOf(toColumnId);
          if (lastTaskIndexInColumn !== -1) {
            reorderedTasks.splice(lastTaskIndexInColumn + 1, 0, finalTask);
          } else {
            reorderedTasks.push(finalTask);
          }
        }

        if (fromColumnId !== toColumnId) {
          connectSocket.emit("updateTask", {
            id: activeId,
            updates: { columnId: toColumnId, editadoPor: userName },
            boardId,
          });
        } else {
          const newOrderInColumn = reorderedTasks
            .filter((t) => t.columnId === toColumnId)
            .findIndex((t) => t._id === activeId);

          connectSocket.emit("changeTaskOrder", {
            taskId: activeId,
            columnId: toColumnId,
            newOrder: newOrderInColumn,
          });
        }

        return reorderedTasks;
      });
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
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
  };
};