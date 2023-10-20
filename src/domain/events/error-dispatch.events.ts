// errors.events.ts
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ErrorDispatch {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitError(error: any) {
    this.eventEmitter.emit('infraError', error);
  }
}
