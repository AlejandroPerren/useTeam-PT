import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  async changeOrder(taskId: string, columnId: string, newOrder: number) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const tasks = await this.taskModel
      .find({ boardId: task.boardId, columnId })
      .sort({ order: 1 });

    const oldIndex = tasks.findIndex(
      (t: any) => (t._id as Types.ObjectId).toString() === taskId,
    );
    if (oldIndex === -1)
      throw new NotFoundException('Task not found in column');

    // Sacamos la tarea del arreglo y la insertamos en la nueva posición
    const [movedTask] = tasks.splice(oldIndex, 1);
    tasks.splice(newOrder, 0, movedTask);

    // Reasignamos todos los order de 0..n
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].order = i;
      await tasks[i].save();
    }

    return tasks;
  }
}
