import { useNavigate } from "react-router-dom";
import type { Board } from "../../types/board.types";

interface BoardCardProps {
  board: Board;
}

const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  const handleOpenBoard = () => {
    localStorage.setItem("selectedBoard", board._id);
    navigate("/kanban");
  };

  return (
    <div className="bg-gray-800 hover:bg-gray-750 rounded-2xl shadow-xl w-72 p-6 flex flex-col justify-between transform hover:scale-105 transition-all duration-200 border border-gray-700/50">
      <div>
        <h2 className="text-2xl font-semibold mb-3 text-white truncate">
          {board.name}
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          ID: <span className="text-gray-300">{board._id}</span>
        </p>
      </div>

      <button
        onClick={handleOpenBoard}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-all"
      >
        Ver Tablero
      </button>
    </div>
  );
};

export default BoardCard;
