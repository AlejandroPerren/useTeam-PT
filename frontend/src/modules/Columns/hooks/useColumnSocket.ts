import { useEffect, useState } from 'react'
import { connectSocket } from '../../../utils/API/SocketIo'
import type { Socket } from 'socket.io-client'
import type { Column } from '../types/column.types'

export const useColumnSocket = () => {
  const [columns, setColumns] = useState<Column[]>([])
  const [hoverColumnId, setHoverColumnId] = useState<string | null>(null)
  const [tasksVersion, setTasksVersion] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)
  const boardId = localStorage.getItem('selectedBoard') || ''

  const normalizeColumn = (col: Column): Column => ({
    _id: col._id,
    title: col.title,
    order: col.order,
    boardId: col.boardId,
  })

  useEffect(() => {
    setSocket(connectSocket)

    connectSocket.on('connect', () => {
      console.log('✅ Conectado:', connectSocket.id)
      connectSocket.emit('joinBoard', boardId)
    })

    connectSocket.on('disconnect', () => console.log('⛔ Desconectado'))

    connectSocket.on('on-columns-initial', (cols: any[]) =>
      setColumns(cols.map(normalizeColumn)),
    )

    connectSocket.on('on-column-created', (col: any) =>
      setColumns((prev) => [...prev, normalizeColumn(col)]),
    )

    connectSocket.on('on-column-updated', (col: any) => {
      const updated = normalizeColumn(col)
      setColumns((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c)),
      )
    })

    connectSocket.on('on-column-deleted', (col: any) =>
      setColumns((prev) => prev.filter((c) => c._id !== (col.id || col._id))),
    )

    connectSocket.on('on-columns-reordered', (cols: any[]) =>
      setColumns(cols.map(normalizeColumn)),
    )
  }, [boardId])

  const handleCreateColumn = () => {
    if (!socket) return
    socket.emit('createColumn', { title: 'Nueva columna', boardId })
  }

  return {
    columns,
    socket,
    boardId,
    hoverColumnId,
    setHoverColumnId,
    tasksVersion,
    setTasksVersion,
    handleCreateColumn,
  }
}
