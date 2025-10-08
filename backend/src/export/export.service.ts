import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExportService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async triggerBacklogExport(boardId: string, email: string) {
    const n8nWebhook = this.config.get<string>('N8N_WEBHOOK_URL');

    if (!n8nWebhook) {
      throw new Error(
        'La variable N8N_WEBHOOK_URL no está definida en el entorno',
      );
    }

    try {
      const payload = { boardId, email };

      const response = await lastValueFrom(this.http.post(n8nWebhook, payload));

      return {
        success: true,
        message: 'Exportación iniciada correctamente',
        response: response.data,
      };
    } catch (error) {
      console.error('Error al disparar webhook N8N:', error.message);
      return {
        success: false,
        message: 'No se pudo disparar el flujo N8N',
        error: error.message,
      };
    }
  }
}
