import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';

@Module({
  imports: [HttpModule],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
