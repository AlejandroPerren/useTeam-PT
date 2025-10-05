import { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FaRegTrashAlt, FaPlus } from 'react-icons/fa'
import type { Column } from '../../types/types'
import type { Task } from '../../types/task.types'
import { getTasks, createTask } from '../../network/fetch/Task'
import TaskCard from '../Tasks/TasksCard'
import DropdownModal from '../ui/DropDownModal'
import { TaskForm } from '../Tasks/TaskForm'

interface Props {
  column: Column
}

const ColumnContainer = ({ column }: Props) => {
  const [modalOpen, setModalOpen] = useState(false)

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column._id,
      data: { type: 'Column', column },
    })

  const boardId = localStorage.getItem('selectedBoard') || ''
  const style = { transition, transform: CSS.Transform.toString(transform) }

  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasksResponse = await getTasks(boardId)
        if (allTasksResponse.ok && allTasksResponse.data) {
          const filteredTasks = allTasksResponse.data.filter(
            (t) => t.columnId === column._id,
          )
          setTasks(filteredTasks)
        } else {
          setTasks([])
        }
      } catch (err) {
        console.error(err)
        setTasks([])
      }
    }
    fetchTasks()
  }, [column._id, boardId])

  const handleCreateTask = async (data: Task) => {
    try {
      const res = await createTask(data)
      if (res.ok && res.data) {
        setTasks([...tasks, res.data])
        setIsModalOpen(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col p-1"
    >
      {/* Title */}
      <div className="text-md bg-gray-950 h-[60px] rounded-t-md border-gray-800 border-2 flex items-center justify-between px-2">
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-gray-900 text-sm rounded-full px-2">
            {tasks.length}
          </div>
          {column.title}
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
      <div className="flex flex-col flex-grow gap-2 overflow-y-auto mt-2">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>

      {/* Footer */}
      <div className="h-[40px] bg-gray-900 rounded-b-md flex items-center justify-center">
        Footer
      </div>

      {/* Modal */}
      <DropdownModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <TaskForm
          columnId={column._id}
          onClose={() => setModalOpen(false)}
          onCreated={(newTask) => setTasks([...tasks, newTask])}
        />
      </DropdownModal>
    </div>
  )
}

export default ColumnContainer
