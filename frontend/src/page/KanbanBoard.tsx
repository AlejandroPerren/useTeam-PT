import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { useColumnSocket } from '../modules/Columns/hooks/useColumnSocket'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { AddColumnButton } from '../modules/Board/components/AddColumnButton'
import { ColumnContainer } from '../modules/Columns/components/ColumnContainer'

const KanbanBoard = () => {
  const {
    columns,
    socket,
    boardId,
    handleCreateColumn,
    hoverColumnId,
    setHoverColumnId,
    setTasksVersion,
  } = useColumnSocket()

  const { sensors, activeItem, onDragStart, onDragOver, onDragEnd } =
    useDragAndDrop({
      columns,
      socket,
      boardId,
      setHoverColumnId,
      setTasksVersion,
    })

  return (
    <div className="m-auto flex min-h-screen w-full items-start overflow-x-auto overflow-y-hidden px-[40px] gap-4 py-6">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={columns.map((c) => c._id)}>
          {columns.map((col) => (
            <ColumnContainer
              key={col._id}
              column={col}
              highlight={hoverColumnId === col._id}
            />
          ))}
        </SortableContext>

        <AddColumnButton onCreate={handleCreateColumn} />

        <DragOverlay>
          {activeItem &&
            createPortal(
              activeItem.type === 'Column' ? (
                <div className="bg-gray-800 w-[350px] rounded-md p-2 shadow-2xl">
                  {activeItem.column.title}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-md p-2 text-sm shadow-2xl">
                  {activeItem.task.title}
                </div>
              ),
              document.body,
            )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default KanbanBoard
