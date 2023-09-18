import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { MondayResponseVo } from 'src/domain/monday/monday-vo';

@Injectable()
export class CallApiService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  run() {
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
