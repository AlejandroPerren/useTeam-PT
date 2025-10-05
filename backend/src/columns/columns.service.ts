import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './column.schema';

@Injectable()
export class ColumnsService {
  constructor(@InjectModel(Column.name) private columnModel: Model<Column>) {}

  findAll(boardId: string) {
    return this.columnModel.find({ boardId }).sort({ order: 1 });
  }

  create(data: any) {
    const newCol = new this.columnModel(data);
    return newCol.save();
  }

  update(id: string, data: any) {
    return this.columnModel.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return this.columnModel.findByIdAndDelete(id);
  }
}
