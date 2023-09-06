import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MondayApiResponse } from 'src/domain/factory/types';

export enum EventTypes {
  SERVICE_ERROR = 'SERVICE_ERROR',
}

@Injectable()
export class MondayService {
  constructor(
    readonly httpService: HttpService,
    readonly eventEmitter: EventEmitter2,
    readonly configService: ConfigService,
  ) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<MondayApiResponse | null> {
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
      query:
        'query{ boards (limit:5) {id name items {name group {title} column_values {title text} } workspace {id name}} }',
    };
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.configService.get<string>('MONDAY_TOKEN'),
      'Api-Version': '2023-04',
    };

    const config: AxiosRequestConfig = { headers: headers };
    const observable = this.httpService.post<MondayApiResponse | null>(
      url,
      body,
      config,
    );

    return observable;
  }
}
