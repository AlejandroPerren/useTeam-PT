import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Task } from '../types/task.types'


export const useTaskSocket = (boardId: string, columnId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const newSocket = io('http://localhost:3000', { auth: { name: 'client' } })
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('🟢 Conectado a socket:', newSocket.id)
      newSocket.emit('joinBoard', boardId)
    })

    newSocket.on('on-tasks-initial', (allTasks: Task[]) => {
      const filtered = allTasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order)
      setTasks(filtered)
    })

    newSocket.on('on-task-created', (task: Task) => {
      if (task.columnId === columnId)
        setTasks((prev) => [...prev, task].sort((a, b) => a.order - b.order))
    })

    newSocket.on('on-task-updated', (task: Task) => {
      if (task.columnId === columnId)
        setTasks((prev) =>
          prev
            .map((t) => (t._id === task._id ? task : t))
            .sort((a, b) => a.order - b.order),
        )
    })

    newSocket.on('on-task-deleted', (task: Task) => {
      setTasks((prev) => prev.filter((t) => t._id !== task._id))
    })

    newSocket.on('on-tasks-reordered', (updatedTasks: Task[]) => {
      const filtered = updatedTasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order)
      setTasks(filtered)
    })

    return () => {
      newSocket.emit('leaveBoard', boardId)
      newSocket.disconnect()
    }
  }, [boardId, columnId])

  return { socket, tasks, setTasks }
}
