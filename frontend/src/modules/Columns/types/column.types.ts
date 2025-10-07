export interface Column {
  _id: string
  title: string
  boardId: string
  order: number
}

export interface CreateColumnBody {
  title: string
  boardId: string
  order?: number
}

export interface UpdateColumnBody {
  title?: string
  order?: number
}
