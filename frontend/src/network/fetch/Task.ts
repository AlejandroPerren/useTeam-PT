import type {
  CreateTaskBody,
  Task,
  UpdateTaskBody,
} from '../../types/task.types'
import { apiFetch } from '../utils/FetchApi'
import { summaryApi } from '../utils/SummaryApi'

export const getTasks = async (boardId: string) => {
  return apiFetch<Task[]>(`${summaryApi.Tasks.url}${boardId}`)
}
export const getTaskById = async (id: string) => {
  return apiFetch<Task>(`${summaryApi.Tasks.url}${id}`)
}

export const createTask = async (body: CreateTaskBody) => {
  return apiFetch(summaryApi.Tasks.url, {
    method: 'POST',
    body,
  })
}

export const updateTask = async (id: string, body: UpdateTaskBody) => {
  return apiFetch(`${summaryApi.Tasks.url}${id}`, {
    method: 'PATCH',
    body,
  })
}

export const deleteTask = async (id: string) => {
  return apiFetch(`${summaryApi.Tasks.url}${id}`, {
    method: 'DELETE',
  })
}
