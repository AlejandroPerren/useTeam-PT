import { useEffect, useState, useMemo } from "react";

import { DndContext, DragOverlay, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import type { Column } from "../types/column.types";
import ColumnContainer from "../components/Columns/ColumnContainer";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../network/utils/SocketIo";
import type { Task } from "../types/task.types";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col._id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const boardId = localStorage.getItem("selectedBoard") || "";
  const [socket, setSocket] = useState<Socket | null>(null);

  const normalizeColumn = (col: Column): Column => ({
    _id: col._id,
    title: col.title,
    order: col.order,
    boardId: col.boardId,
  });

  // Traer columnas reales
  useEffect(() => {
    setSocket(connectSocket);

    connectSocket.on("connect", () => {
      console.log("✅ Conectado:", connectSocket.id);
      connectSocket.emit("joinBoard", boardId);
    });

    connectSocket.on("disconnect", () => console.log("⛔ Desconectado"));

    connectSocket.on("on-columns-initial", (cols: any[]) =>
      setColumns(cols.map(normalizeColumn))
    );
  }, [boardId]);

  const handleCreateColumn = async () => {
    if (!boardId) return;

    const newColumn = {
      title: `Nueva columna ${columns.length + 1}`,
      boardId,
      order: columns.length,
    };

    try {
      connectSocket.emit("createColumn", newColumn);
      connectSocket.once("on-column-created", (col) => {
        setColumns((prev) => [...prev, normalizeColumn(col)]);
      });
    } catch (err) {
      console.error("Error creando columna:", err);
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
  };

  const onDragEnd = async (event) => {
    setActiveColumn(null);

    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = columns.findIndex((col) => col._id === active.id);
    const newIndex = columns.findIndex((col) => col._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedColumns = [...columns];
    const [moved] = updatedColumns.splice(oldIndex, 1);
    updatedColumns.splice(newIndex, 0, moved);

    setColumns(updatedColumns);

    try {
      connectSocket.emit("changeColumnOrder", {
        columnId: active.id,
        newOrder: newIndex,
      });
    } catch (err) {
      console.error("Error al emitir cambio de orden:", err);
    }
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] gap-4">
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <ColumnContainer key={col._id} column={col} boardId={boardId} />
          ))}
        </SortableContext>

        <button
          onClick={handleCreateColumn}
          className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-gray-800 border-2 border-gray-950 ring-rose-500 hover:ring-2 self-start mt-4"
        >
          Add Column
        </button>

        <DragOverlay>
          {activeColumn &&
            createPortal(
              <ColumnContainer column={activeColumn} />,
              document.body
            )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
