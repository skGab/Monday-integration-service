import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { MondayResponseVo } from 'src/domain/valueObjects/monday-response.vo';

@Injectable()
export class ApiCallService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  run() {
    const url = 'https://api.monday.com/v';

    const body = {
      query:
        'query{ boards (limit:5, ids:5073094843) {id state name items {name state group {title} column_values {title text} } workspace {id state name}} workspaces (limit: 1,ids: 2990734) {id state name} }',
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
