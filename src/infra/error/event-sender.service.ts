import { EventTypes } from 'src/application/events/event-handle.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpError } from './http-error';

export class EventSenderService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  // SENDIND ERROR EVENTS
  errorEvent(cause: string | any, place: string): any {
    let errorMessage = cause.message;
    if (cause instanceof HttpError && cause.details) {
      errorMessage += ` - Details: ${JSON.stringify(cause.details)}`;
    }

    this.eventEmitter.emit(EventTypes.SERVICE_ERROR, {
      source: place,
      error: errorMessage,
    });
    return null;
  }
}
