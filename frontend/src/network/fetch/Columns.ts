import type { CreateColumnBody, UpdateColumnBody } from '../../types/column.types'
import type { Column } from '../../types/types'
import { apiFetch } from '../utils/FetchApi'
import { summaryApi } from '../utils/SummaryApi'

export const getColumns = async (boardId: string) => {
  return apiFetch<Column[]>(`${summaryApi.Columns.url}${boardId}`)
}

export const createColumn = async (body: CreateColumnBody) => {
  return apiFetch<Column>(summaryApi.Columns.url, {
    method: 'POST',
    body,
  })
}

export const updateColumn = async (id: string, body: UpdateColumnBody) => {
  return apiFetch(`${summaryApi.Columns.url}${id}`, {
    method: 'PATCH',
    body,
  })
}

export const deleteColumn = async (id: string) => {
  return apiFetch(`${summaryApi.Columns.url}${id}`, {
    method: 'DELETE',
  })
}
