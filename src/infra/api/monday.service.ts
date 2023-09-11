import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MondayApiResponse } from 'src/domain/factory/types';
import { HttpError } from '../error/http-error';
import { EventSenderService } from '../error/event-sender.service';

@Injectable()
export class MondayService {
  constructor(
    readonly httpService: HttpService,
    readonly eventEmitter: EventEmitter2,
    readonly configService: ConfigService,
    private eventSenderService: EventSenderService,
  ) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<MondayApiResponse | null> {
    try {
      const { data } = await lastValueFrom(this.apiCall());

      return data;
    } catch (error) {
      if (error.isAxiosError && error.response) {
        // Create a custom error object
        const httpError = new HttpError(
          error.response.status,
          error.response.statusText,
          error.response.data,
        );

        this.eventSenderService.errorEvent(httpError, 'MondayService');

        return null;
      } else {
        this.eventSenderService.errorEvent(error, 'MondayService');

        return null;
      }
    }
  }

  // SETTING THE REQUEST CONFIGURATION
  apiCall() {
    const url = 'https://api.monday.com/v2';

    const body = {
      query:
        'query{ boards (limit:1) {id name items {name group {title} column_values {title text} } workspace {id name}} workspaces (limit:5) {id name} }',
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
