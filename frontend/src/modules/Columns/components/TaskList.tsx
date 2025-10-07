import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../Task/types/task.types'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface TasksListProps {
  tasks: Task[]
  onMoveTask: (taskId: string, direction: 'left' | 'right') => void
}

export const TasksList: React.FC<TasksListProps> = ({ tasks, onMoveTask }) => {
  return (
    <div className="flex flex-col gap-3 p-3">
      {tasks.map((task) => (
        <SortableTaskItem key={task._id} task={task} onMoveTask={onMoveTask} />
      ))}
    </div>
  )
}

interface SortableTaskItemProps {
  task: Task
  onMoveTask: (taskId: string, direction: 'left' | 'right') => void
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  onMoveTask,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
      data: { type: 'Task', task },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white shadow rounded-xl p-3 flex flex-col gap-2 border border-gray-100 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
        <div className="flex gap-2 text-gray-400">
          <button
            onClick={() => onMoveTask(task._id, 'left')}
            className="hover:text-blue-500"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => onMoveTask(task._id, 'right')}
            className="hover:text-blue-500"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600">{task.description}</p>
      )}
    </div>
  )
}
