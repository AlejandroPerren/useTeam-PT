import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './tasks.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  findAll(boardId: string, columnId?: string) {
    const filter: any = { boardId };
    if (columnId) filter.columnId = columnId;
    return this.taskModel.find(filter).sort({ order: 1 });
  }

  create(data: any) {
    if (!data.creadoPor) {
      throw new Error('El campo "creadoPor" es obligatorio');
    }
    const task = new this.taskModel(data);
    return task.save();
  }

  update(id: string, data: any) {
    if (!data.editadoPor) {
      throw new Error('Debe especificar "editadoPor" al actualizar');
    }
    return this.taskModel.findByIdAndUpdate(id, data, { new: true });
  }

  remove(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }

  async changeOrder(taskId: string, columnId: any, newOrder: number) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const { boardId, order: oldOrder } = task;
    if (oldOrder === newOrder) return task;

    const direction = newOrder > oldOrder ? 1 : -1;

    await this.taskModel.updateMany(
      {
        boardId,
        columnId,
        order:
          direction === 1
            ? { $gt: oldOrder, $lte: newOrder }
            : { $lt: oldOrder, $gte: newOrder },
      },
      { $inc: { order: -direction } },
    );

    task.order = newOrder;
    task.columnId = columnId;
    await task.save();

    return await this.taskModel.find({ boardId, columnId }).sort({ order: 1 });
  }
}
