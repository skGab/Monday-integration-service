import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export abstract class ApiService {
  httpService: HttpService;
  eventEmitter: EventEmitter2;

  abstract run(): Promise<any[] | null>;

  abstract errorEvent(
    cause: string | any,
    place: string,
  ): { source: string; error: string | any };

  abstract apiCall(): Observable<AxiosResponse<any[], any>>;
}
