import BoardList from '../modules/Board/components/BoardList'

const KanbanBoardsList = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Tableros</h1>
      <BoardList />
    </div>
  )
}

export default KanbanBoardsList
