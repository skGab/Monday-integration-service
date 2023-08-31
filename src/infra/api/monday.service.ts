import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, lastValueFrom } from 'rxjs';
import { EventTypes } from 'src/application/services/error-handling.service';
import { ConfigService } from '@nestjs/config';

interface ResponseParamns {}

abstract class ApiService {
  httpService: HttpService;
  eventEmitter: EventEmitter2;

  abstract run(): Promise<any[] | null>;

  abstract errorEvent(
    cause: string | any,
    place: string,
  ): { source: string; error: string | any };

  abstract apiCall(): Observable<AxiosResponse<any[], any>>;
}

@Injectable()
export class MondayService implements ApiService {
  constructor(
    readonly httpService: HttpService,
    readonly eventEmitter: EventEmitter2,
    readonly configService: ConfigService,
  ) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<any[]> {
    try {
      const { data } = await lastValueFrom(this.apiCall());

      if (!data) {
        this.errorEvent('Nenhum dado encontrado', 'MondayService');
      }

      return data;
    } catch (error) {
      this.errorEvent(error, 'MondayService');
      return null;
    }
  }

  // SENDIND ERROR EVENTS
  errorEvent(cause: string | any, place: string): any {
    this.eventEmitter.emit(EventTypes.SERVICE_ERROR, {
      source: place,
      error: cause,
    });
    return null;
  }

  // SETTING THE REQUEST CONFIGURATION
  apiCall() {
    const url = 'https://api.monday.com/v2';

    const body = {
      query: 'query{boards (limit:5) {id name} }',
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.configService.get<string>('MONDAY_TOKEN'),
      'Api-Version': '2023-04',
    };

    const config: AxiosRequestConfig = { headers: headers };
    const observable = this.httpService.post<any[]>(url, body, config);

    return observable;
  }
}
