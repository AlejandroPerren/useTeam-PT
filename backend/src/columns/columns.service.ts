import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Column } from './column.schema';
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

    const { boardId, order: oldOrder } = column;
    if (oldOrder === newOrder) return column;

    const direction = newOrder > oldOrder ? 1 : -1;

    await this.columnModel.updateMany(
      {
        boardId,
        order:
          direction === 1
            ? { $gt: oldOrder, $lte: newOrder }
            : { $lt: oldOrder, $gte: newOrder },
      },
      { $inc: { order: -direction } },
    );

    column.order = newOrder;
    await column.save();

    return await this.columnModel.find({ boardId }).sort({ order: 1 });
  }
}
