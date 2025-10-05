import { createHashRouter } from 'react-router-dom'
import App from './App'
import KanbanBoard from './page/KanbanBoard'
import KanbanBoardsList from './page/KanbanBoardsList'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <KanbanBoardsList/> },
      { path: 'kanban', element: <KanbanBoard /> },
    ],
  },
])
