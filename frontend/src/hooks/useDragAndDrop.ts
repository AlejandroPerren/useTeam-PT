import { useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import type { Socket } from 'socket.io-client'
import type { Column } from '../modules/Columns/types/column.types'
import { useState } from 'react'

interface Props {
  columns: Column[]
  socket: Socket | null
  boardId: string
  setHoverColumnId: (id: string | null) => void
  setTasksVersion: React.Dispatch<React.SetStateAction<number>>
}

export const useDragAndDrop = ({
  columns,
  socket,
  boardId,
  setHoverColumnId,
}: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )
  const [activeItem, setActiveItem] = useState<any | null>(null)

  const onDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.data.current ?? null)
  }

  const onDragOver = (event: DragOverEvent) => {
    const over = event.over
    if (!over) return setHoverColumnId(null)
    const overData = (over.data as any)?.current
    if (overData?.type === 'Column') setHoverColumnId(over.id as string)
    else if (overData?.type === 'Task') setHoverColumnId(overData.task.columnId)
    else setHoverColumnId(null)
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    setHoverColumnId(null)
    if (!over || active.id === over.id) return

    const activeData = active.data.current
    const overData = over.data.current

    if (activeData?.type === 'Column' && overData?.type === 'Column') {
      const oldIndex = columns.findIndex((c) => c._id === active.id)
      const newIndex = columns.findIndex((c) => c._id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const reordered = arrayMove(columns, oldIndex, newIndex)
      if (socket) {
        socket.emit('reorderColumns', {
          boardId,
          columns: reordered.map((col, index) => ({
            id: col._id,
            order: index,
          })),
        })
      }
      return
    }
    if (activeData?.type === 'Task') {
      const task = activeData.task
      const taskId = task._id
      let targetColumnId: string
      let newOrder: number

      if (overData?.type === 'Task') {
        targetColumnId = overData.task.columnId
        newOrder = overData.task.order
      } else if (overData?.type === 'Column') {
        targetColumnId = String(over.id)
        newOrder = 999999
      } else return

      if (socket) {
        socket.emit('moveTask', { taskId, targetColumnId, newOrder })
      }
    }
  }

  return { sensors, activeItem, onDragStart, onDragOver, onDragEnd }
}
