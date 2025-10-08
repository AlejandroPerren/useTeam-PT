import { Controller, Post, Body } from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('backlog')
  async exportBacklog(@Body() body: { boardId: string; email: string }) {
    return this.exportService.triggerBacklogExport(body.boardId, body.email);
  }
}
