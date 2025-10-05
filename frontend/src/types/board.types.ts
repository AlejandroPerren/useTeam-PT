export interface Board {
  _id: string
  name: string
  createdAt: string
}

export interface CreateBoardBody {
  name: string
  description?: string
}

export interface UpdateBoardBody {
  name?: string
  description?: string
}
