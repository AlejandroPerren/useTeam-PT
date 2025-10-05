import type { Task } from '../../types/task.types'

interface Props {
  task: Task
}

const TaskCard = ({ task }: Props) => {
  return (
    <div className="bg-gray-900 rounded-md p-2 text-sm cursor-pointer hover:bg-gray-800 transition">
      <div className="font-semibold">{task.title}</div>
      {task.description && (
        <div className="text-xs text-gray-400">{task.description}</div>
      )}
    </div>
  )
}

export default TaskCard
