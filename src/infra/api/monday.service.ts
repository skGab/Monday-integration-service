import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { MondayResponseVo } from 'src/domain/valueObjects/monday-vo';

@Injectable()
export class MondayService {
  private logger = new Logger(MondayService.name);

  constructor(
    readonly httpService: HttpService,
    readonly eventEmitter: EventEmitter2,
    readonly configService: ConfigService,
  ) {}

  // RUNNING THE MAIN FUNCTION
  async run(): Promise<MondayResponseVo | null> {
    try {
      const { data } = await lastValueFrom(this.apiCall());

      return data;
    } catch (error) {
      this.logger.error(error);

      return null;
    }
  }

  // SETTING THE REQUEST CONFIGURATION
  apiCall() {
    const url = 'https://api.monday.com/v2';

    const body = {
      query:
        'query{ boards (limit:5, ids:5073094843) {id name items {name group {title} column_values {title text} } workspace {id name}} workspaces (limit: 1,ids: 2990734) {id name} }',
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.configService.get<string>('MONDAY_TOKEN'),
      'Api-Version': '2023-04',
    };

    const config: AxiosRequestConfig = { headers: headers };
    const observable = this.httpService.post<MondayResponseVo | null>(
      url,
      body,
      config,
    );

    return observable;
  }
}
