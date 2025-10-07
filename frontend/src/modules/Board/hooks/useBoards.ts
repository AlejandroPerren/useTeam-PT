import { useEffect, useState } from 'react'
import type { Board } from '../types/board.types'
import { getAllBoards } from '../network/Boards'

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getAllBoards()
        if (res.ok && res.data) {
          setBoards(res.data)
        } else {
          setError('Error al cargar los tableros')
        }
      } catch (err) {
        setError('Error de red')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBoards()
  }, [])

  return { boards, loading, error }
}
