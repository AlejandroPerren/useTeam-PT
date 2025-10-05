import { useEffect, useState, useMemo } from 'react'

import { DndContext, DragOverlay, type DragStartEvent } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import type { Column } from '../types/types'
import {
  createColumn,
  getColumns,
  updateColumn,
} from '../network/fetch/Columns'
import ColumnContainer from '../components/Columns/ColumnContainer'

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const columnsId = useMemo(() => columns.map((col) => col._id), [columns])
  const [activeColumn, setActiveColumn] = useState<Column | null>(null)
  const boardId = localStorage.getItem('selectedBoard') || ''

  // Traer columnas reales
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await getColumns(boardId)
        if (response.ok && response.data) {
          setColumns(response.data.filter((col) => col.boardId === boardId))
        }
      } catch (err) {
        console.error(err)
      }
    }
    if (boardId) fetchColumns()
  }, [boardId])

  // Crear columna real
  const handleCreateColumn = async () => {
    if (!boardId) return
    const newColumn = {
      title: `Nueva columna ${columns.length + 1}`,
      boardId,
      order: columns.length,
    }

    try {
      const res = await createColumn(newColumn)
      if (res.ok && res.data) setColumns([...columns, res.data])
    } catch (err) {
      console.error(err)
    }
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column)
    }
  }

  const onDragEnd = async () => {
    setActiveColumn(null)
    // Guardar el nuevo orden
    try {
      for (let i = 0; i < columns.length; i++) {
        await updateColumn(columns[i]._id, { order: i })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] gap-4">
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <ColumnContainer key={col._id} column={col} />
          ))}
        </SortableContext>

        <button
          onClick={handleCreateColumn}
          className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-gray-800 border-2 border-gray-950 ring-rose-500 hover:ring-2 self-start mt-4"
        >
          Add Column
        </button>

        <DragOverlay>
          {activeColumn &&
            createPortal(
              <ColumnContainer column={activeColumn} />,
              document.body,
            )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default KanbanBoard
