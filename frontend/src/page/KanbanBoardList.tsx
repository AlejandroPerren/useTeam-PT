import { useEffect, useState } from "react";
import type { Board } from "../types/board.types";
import { getAllBoards } from "../network/fetch/Board.fetch";
import BoardCard from "../components/board/BoardCard";

const KanbanBoardsList = () => {
  const [boardList, setBoardList] = useState<Board[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getAllBoards();
        if (res.ok && res.data) setBoardList(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBoards();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Tableros</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {boardList.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoardsList;
