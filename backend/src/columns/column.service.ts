import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Column } from './columns.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ColumnsService {
  constructor(@InjectModel(Column.name) private columnModel: Model<Column>) {}

  async findAll(boardId: string) {
    return this.columnModel.find({ boardId }).sort({ order: 1 });
  }

  async create(data: any) {
    const newCol = new this.columnModel(data);
    return await newCol.save();
  }

  async update(id: string, data: any) {
    const updated = await this.columnModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.columnModel.findByIdAndDelete(id);
    return deleted;
  }

  async changeOrder(columnId: string, newOrder: number) {
    const column = await this.columnModel.findById(columnId);
    if (!column) throw new NotFoundException('Column not found');

    const columns = await this.columnModel
      .find({ boardId: column.boardId })
      .sort({ order: 1 });

    // Reordenamos todo en memoria
    const oldIndex = columns.findIndex(
      (col) => col._id.toString() === columnId,
    );
    if (oldIndex === -1)
      throw new NotFoundException('Column not found in board');

    const [movedColumn] = columns.splice(oldIndex, 1);
    columns.splice(newOrder, 0, movedColumn);

    // Asignamos nuevos valores de order
    for (let i = 0; i < columns.length; i++) {
      columns[i].order = i;
      await columns[i].save();
    }

    return columns;
  }
}
