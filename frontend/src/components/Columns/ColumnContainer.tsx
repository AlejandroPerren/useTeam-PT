import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegTrashAlt, FaPlus } from "react-icons/fa";

import type { CreateTaskBody, Task } from "../../types/task.types";

import { TaskForm } from "../Tasks/TaskForm";
import type { Column } from "../../types/column.types";
import DropdownModal from "../ui/DropDownModal";
import TaskCard from "../Tasks/TaskCard";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../../network/utils/SocketIo";

interface Props {
  column: Column;
  boardId: any;
}

const ColumnContainer = ({ column, boardId }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column._id,
      data: { type: "Column", column },
    });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  useEffect(() => {
    connectSocket.on("on-tasks-initial", (tasks) => {
      const filtered = tasks.filter((t) => t.columnId === column._id);
      setTasks(filtered);
    });
  }, [column._id, boardId]);

  const handleCreateTask = (data: CreateTaskBody) => {
    if (!socket) return;
    socket.emit("create-task", {
      ...data,
      boardId,
      columnId: column._id,
      creadoPor: "Alejandro",
    });
    setModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col p-1"
    >
      {/* Title */}
      <div className="text-md bg-gray-950 h-[60px] text-white rounded-t-md border-gray-800 border-2 flex items-center justify-between px-2">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-gray-900 text-sm rounded-full px-2">
            {tasks.length}
          </div>
          {column._id}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-green-500 transition-all px-2 py-1 text-sm rounded-full"
          >
            <FaPlus />
          </button>
          <button className="text-white hover:text-red-500 transition-all px-2 py-1 text-sm rounded-full">
            <FaRegTrashAlt />
          </button>
        </div>
      </div>

      {/* Tasks container */}
      <div className="flex flex-col flex-grow gap-2 overflow-y-auto mt-2 px-1">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      {/* Footer */}
      <div className="h-[40px] bg-gray-900 rounded-b-md flex items-center justify-center text-gray-400 text-sm">
        {column._id}
      </div>

      {/* Modal */}
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
