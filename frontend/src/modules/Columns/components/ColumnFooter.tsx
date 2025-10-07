import { FaPlusCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface ColumnFooterProps {
  columnId: string
  onAddTask: (columnId: string) => void
  onMoveLeft: () => void
  onMoveRight: () => void
}

export const ColumnFooter: React.FC<ColumnFooterProps> = ({
  columnId,
  onAddTask,
  onMoveLeft,
  onMoveRight,
}) => {
  return (
    <div className="flex justify-between items-center py-2 border-t border-gray-200 px-2">
      <div className="flex gap-2">
        <button
          onClick={onMoveLeft}
          className="text-gray-600 hover:text-violet-600 transition-colors"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={onMoveRight}
          className="text-gray-600 hover:text-violet-600 transition-colors"
        >
          <FaArrowRight />
        </button>
      </div>
      <button
        onClick={() => onAddTask(columnId)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
      >
        <FaPlusCircle />
        <span>Agregar tarea</span>
      </button>
    </div>
  )
}
