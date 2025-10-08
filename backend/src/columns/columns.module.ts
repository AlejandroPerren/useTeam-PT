import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Column, ColumnSchema } from './columns.schema';
import { ColumnGateway } from './column.gateway';
import { ColumnsService } from './column.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
  ],
  providers: [ColumnsService, ColumnGateway],
  exports: [ColumnsService],
})
export class ColumnsModule {}
