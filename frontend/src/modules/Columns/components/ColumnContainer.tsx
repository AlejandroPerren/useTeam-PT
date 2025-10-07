import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTaskSocket } from '../../Task/hooks/useTaskSocket'
import type { Column } from '../types/column.types'
import type { CreateTaskBody } from '../../Task/types/task.types'
import DropdownModal from '../../../components/ui/DropDownModal'
import { TaskForm } from '../../Task/components/TaskForm'
import { ColumnFooter } from './ColumnFooter'
import { TasksList } from './TaskList'
import { ColumnHeader } from './ColumnHeader'

interface Props {
  column: Column
  highlight?: boolean
}
export const ColumnContainer = ({ column, highlight = false }: Props) => {
  const boardId = localStorage.getItem('selectedBoard') || ''
  const { socket, tasks } = useTaskSocket(boardId, column._id)

  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState(column.title)

  const { setNodeRef, transform, transition } = useSortable({
    id: column._id,
    data: { type: 'Column', column },
  })

  const style = { transition, transform: CSS.Transform.toString(transform) }

  const handleCreateTask = (data: CreateTaskBody) => {
    if (!socket) return
    socket.emit('createTask', {
      ...data,
      boardId,
      columnId: column._id,
      creadoPor: 'Alejandro',
    })
    setModalOpen(false)
  }

  const handleUpdateTitle = () => {
    if (!socket || !titleInput.trim()) return
    socket.emit('updateColumn', {
      id: column._id,
      title: titleInput.trim(),
      boardId,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!socket) return
    socket.emit('deleteColumn', { id: column._id, boardId })
  }

  const handleMoveColumn = (direction: 'left' | 'right') => {
    const stored = localStorage.getItem('columns')
    const cols: Column[] = stored ? JSON.parse(stored) : []
    const idx = cols.findIndex((c) => c._id === column._id)
    const newIdx = direction === 'left' ? idx - 1 : idx + 1
    if (idx === -1 || newIdx < 0 || newIdx >= cols.length) return

    const reordered = [...cols]
    const [moved] = reordered.splice(idx, 1)
    reordered.splice(newIdx, 0, moved)

    localStorage.setItem('columns', JSON.stringify(reordered))
    socket?.emit('reorderColumns', {
      boardId,
      columns: reordered.map((col, i) => ({ id: col._id, order: i })),
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800 w-[350px] h-[500px] rounded-md flex flex-col p-1 transition-all ${
        highlight
          ? 'ring-4 ring-violet-400/80 shadow-[0_0_24px_rgba(167,139,250,0.5)]'
          : ''
      }`}
    >
      <ColumnHeader
        title={column.title}
        tasksCount={tasks.length}
        isEditing={isEditing}
        titleInput={titleInput}
        setTitleInput={setTitleInput}
        onEdit={() => setIsEditing(true)}
        onUpdate={handleUpdateTitle}
        onDelete={handleDelete}
        onOpenModal={() => setModalOpen(true)}
      />

      <TasksList
        tasks={tasks}
        onMoveTask={(taskId, direction) => {
          if (!socket) return
          socket.emit('moveTask', { taskId, direction })
        }}
      />

      <ColumnFooter
        columnId={column._id}
        onAddTask={() => setModalOpen(true)}
        onMoveLeft={() => handleMoveColumn('left')}
        onMoveRight={() => handleMoveColumn('right')}
      />
      <DropdownModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <TaskForm
          onSubmit={handleCreateTask}
          boardId={boardId}
          columnId={column._id}
        />
      </DropdownModal>
    </div>
  )
}
