import { useBoards } from '../hooks/useBoards'
import BoardCard from './BoardCard'

const BoardList = () => {
  const { boards, loading, error } = useBoards()

  if (loading)
    return <p className="text-center text-white">Cargando tableros...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!boards.length)
    return <p className="text-center text-white">No hay tableros aún</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
      {boards.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
    </div>
  )
}

export default BoardList
