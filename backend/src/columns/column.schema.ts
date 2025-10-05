import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Board } from 'src/boards/board.schema';

@Schema({ timestamps: true })
export class Column extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: Board.name, required: true })
  boardId: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
