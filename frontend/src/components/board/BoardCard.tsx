import type { Board } from "../../types/board.types";

interface BoardCardProps {
  board: Board;
}

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg w-72 p-5 flex flex-col justify-between hover:scale-[1.03] transition-transform cursor-pointer">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-white">{board.name}</h2>
      </div>

      <div className="mt-4">
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all">
          Ver Tablero
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
