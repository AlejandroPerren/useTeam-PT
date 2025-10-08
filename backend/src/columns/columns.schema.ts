import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Board } from 'src/boards/board.schema';

@Schema({ timestamps: true })
export class Column {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: Board.name, required: true })
  boardId: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;
}

export type ColumnDocument = HydratedDocument<Column>;

export const ColumnSchema = SchemaFactory.createForClass(Column);
