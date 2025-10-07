import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types/task.types'

interface Props {
  task: Task
}

const TaskCard = ({ task }: Props) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
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
      className="bg-gray-900 rounded-md p-2 text-sm cursor-grab hover:bg-gray-800 transition select-none"
    >
      <div className="font-semibold">{task.title}</div>
      {task.description && (
        <div className="text-xs text-gray-400">{task.description}</div>
      )}
    </div>
  )
}

export default TaskCard
