import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ColumnsService } from './columns.service';
import { Column, ColumnSchema } from './column.schema';
import { ColumnGateway } from './column.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
  ],
  providers: [ColumnsService, ColumnGateway],
  exports: [ColumnsService],
})
export class ColumnsModule {}
