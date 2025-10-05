import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Column } from 'src/columns/column.schema';
import { Board } from 'src/boards/board.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: Board.name, required: true })
  boardId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Column.name, required: true })
  columnId: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: true })
  creadoPor: string;

  @Prop()
  editadoPor?: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
