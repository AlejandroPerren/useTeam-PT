export interface Board {
  _id: string;
  name: string;
  createdBy: string;
}

export interface CreateBoardBody {
  name: string;
  createdBy: string;
}

export interface UpdateBoardBody {
  name?: string;
  description?: string;
}
