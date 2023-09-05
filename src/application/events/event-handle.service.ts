import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventTypes } from 'src/infra/api/monday.service';

@Injectable()
export class EventHandleService {
  private readonly logger = new Logger(EventHandleService.name);

  @OnEvent(EventTypes.SERVICE_ERROR)
  runEvent(payload: { source: string; error: any }) {
    const { source, error } = payload;

    this.logger.error(`Disparo do evento: ${source}`, `Causa: ${error}`);
  }
}
