import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ApiService } from './api.service';

export enum EventTypes {
  SERVICE_ERROR = 'SERVICE_ERROR',
}

type Column_values = {
  title: string;
  text: string;
};

type Items = {
  name: string;
  groups: { title: string };
  column_values: Column_values[];
};

type BoardResponse = {
  id: string;
  name: string;
  items: Items[];
  workspace: { id: number; name: string };
};

@Injectable()
export class MondayService implements ApiService {
  constructor(
    readonly httpService: HttpService,
    readonly eventEmitter: EventEmitter2,
    readonly configService: ConfigService,
  ) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<BoardResponse[] | null> {
    try {
      const { data } = await lastValueFrom(this.apiCall());

      if (!data) {
        this.errorEvent('Nenhum dado encontrado', 'MondayService');
      }

      console.log(data);
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
    const observable = this.httpService.post<BoardResponse[] | null>(
      url,
      body,
      config,
    );

    return observable;
  }
}
