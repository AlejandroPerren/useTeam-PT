import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './board.schema';

@Injectable()
export class BoardsService {
  constructor(@InjectModel(Board.name) private boardModel: Model<Board>) {}

  findAll() {
    return this.boardModel.find();
  }

  findOne(id: string) {
    return this.boardModel.findById(id);
  }

  create(data: any) {
    const newBoard = new this.boardModel(data);
    return newBoard.save();
  }

  update(id: string, data: any) {
    return this.boardModel.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return this.boardModel.findByIdAndDelete(id);
  }
}
