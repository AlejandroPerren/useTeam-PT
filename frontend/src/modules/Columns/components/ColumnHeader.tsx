import { FaPlus, FaGripVertical, FaRegTrashAlt } from 'react-icons/fa'

interface ColumnHeaderProps {
  title: string
  tasksCount: number
  isEditing: boolean
  titleInput: string
  setTitleInput: React.Dispatch<React.SetStateAction<string>>
  onEdit: () => void
  onUpdate: () => void
  onDelete: () => void
  onOpenModal: () => void
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  title,
  tasksCount,
  isEditing,
  titleInput,
  setTitleInput,
  onEdit,
  onUpdate,
  onDelete,
  onOpenModal,
}) => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <FaGripVertical className="text-gray-400 cursor-grab" />

        {isEditing ? (
          <input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={onUpdate}
            className="bg-transparent border-b border-gray-400 text-gray-100 outline-none"
            autoFocus
          />
        ) : (
          <h3
            className="font-semibold text-gray-100 cursor-pointer"
            onClick={onEdit}
          >
            {title} ({tasksCount})
          </h3>
        )}
      </div>

      <div className="flex items-center gap-3 text-gray-400">
        <button
          onClick={onOpenModal}
          className="hover:text-green-400 transition-colors"
          title="Agregar tarea"
        >
          <FaPlus />
        </button>

        <button
          onClick={onDelete}
          className="hover:text-red-500 transition-colors"
          title="Eliminar columna"
        >
          <FaRegTrashAlt />
        </button>
      </div>
    </div>
  )
}
