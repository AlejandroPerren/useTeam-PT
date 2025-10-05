import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  findAll(boardId: string) {
    return this.taskModel.find({ boardId }).sort({ order: 1 });
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
    return this.taskModel.findByIdAndUpdate(id, { ...data }, { new: true });
  }

  remove(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }
}
