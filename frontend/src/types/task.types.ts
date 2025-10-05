export interface Task {
  _id: string
  title: string
  description?: string
  boardId: string
  columnId: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateTaskBody {
  title: string
  description?: string
  boardId: string
  columnId: string
  order?: number
  createdAt: string
}

export interface UpdateTaskBody {
  title?: string
  description?: string
  columnId?: string
  order?: number
  editadoPor?: string
}
