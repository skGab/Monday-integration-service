import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export enum EventTypes {
  SERVICE_ERROR = 'SERVICE_ERROR',
}

@Injectable()
export class EventHandleService {
  private readonly logger = new Logger(EventHandleService.name);

  @OnEvent(EventTypes.SERVICE_ERROR)
  runEvent(payload: { source: string; error: any }) {
    const { source, error } = payload;

    this.logger.error(`Disparo do evento: ${source}`, `Causa: ${error}`);
  }
}
