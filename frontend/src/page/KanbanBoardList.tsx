import { useEffect, useState } from "react";
import type { Board } from "../types/board.types";
import { getAllBoards } from "../network/fetch/Board.fetch";
import BoardCard from "../components/board/BoardCard";
import DropdownModal from "../components/ui/DropDownModal";

const KanbanBoardsList = () => {
  const [boardList, setBoardList] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const currentUser = localStorage.getItem("currentUser");
    const clientUser = localStorage.getItem("clientUser");
    if (!userName || !clientUser || !currentUser) setIsModalOpen(true);
  }, []);

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

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    localStorage.setItem("userName", nameInput.trim());
    localStorage.setItem("currentUser", nameInput.trim());
    localStorage.setItem("clientUser", nameInput.trim());
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-400 drop-shadow-md">
        Mis Tableros
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {boardList.length === 0 ? (
          <p className="text-gray-400 text-lg">No hay tableros disponibles.</p>
        ) : (
          boardList.map((board) => <BoardCard key={board._id} board={board} />)
        )}
      </div>

      <DropdownModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Bienvenido 👋
        </h2>
        <p className="text-gray-300 mb-4 text-center">
          Ingresá un nombre para identificarte en los tableros.
        </p>
        <input
          type="text"
          placeholder="Tu nombre..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="w-full p-3 mb-5 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
        />
        <button
          onClick={handleSaveName}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition-all font-semibold"
        >
          Confirmar
        </button>
      </DropdownModal>
    </div>
  );
};

export default KanbanBoardsList;
