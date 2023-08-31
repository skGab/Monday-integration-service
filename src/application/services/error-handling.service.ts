import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export enum EventTypes {
  SERVICE_ERROR = 'SERVICE_ERROR',
}

// export class ServiceError extends Error {
//   constructor(
//     public status: number,
//     public serviceMessage: string,
//     message: string,
//   ) {
//     super(message);
//   }
// }

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  @OnEvent(EventTypes.SERVICE_ERROR)
  runEvent(payload: { source: string; error: any }) {
    const { source, error } = payload;

    this.logger.error(`Disparo do evento: ${source}`, `Causa: ${error}`);
  }
}
