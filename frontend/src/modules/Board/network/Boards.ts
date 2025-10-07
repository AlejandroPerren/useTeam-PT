import { apiFetch } from '../../../utils/API/FetchApi'
import { summaryApi } from '../../../utils/API/SummaryApi'
import type {
  UpdateBoardBody,
  Board,
  CreateBoardBody,
} from '../types/board.types'

export const getBoards = async () => {
  return apiFetch<Board>(summaryApi.Boards.url)
}
export const getAllBoards = async () => {
  return apiFetch<Board[]>(summaryApi.Boards.url)
}

export const createBoard = async (body: CreateBoardBody) => {
  return apiFetch<Board>(summaryApi.Boards.url, {
    method: 'POST',
    body,
  })
}

export const updateBoard = async (id: string, body: UpdateBoardBody) => {
  return apiFetch(`${summaryApi.Boards.url}${id}`, {
    method: 'PATCH',
    body,
  })
}

export const deleteBoard = async (id: string) => {
  return apiFetch(`${summaryApi.Boards.url}${id}`, {
    method: 'DELETE',
  })
}
