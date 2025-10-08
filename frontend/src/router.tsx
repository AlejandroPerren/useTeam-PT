import { createHashRouter } from "react-router-dom";
import App from "./App";
import KanbanBoard from "./page/KanbanBoard";
import KanbanBoardsList from "./page/KanbanBoardList";
import NotFound from "./page/404";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <KanbanBoardsList /> },
      { path: "kanban", element: <KanbanBoard /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
