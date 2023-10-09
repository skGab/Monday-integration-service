import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Board } from 'src/domain/entities/board/board';
import { Workspace } from 'src/domain/entities/board/workspace';

export interface MondayResponseVo {
  data: {
    boards: Board[];
    workspaces: Workspace[];
  };
  account_id: number;
}

export interface ErrorResponse {
  errors: {
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
  }[];
  account_id?: number;
}

export type ApiResponseType = MondayResponseVo | ErrorResponse;

@Injectable()
export class ApiCallService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  run() {
    const url = 'https://api.monday.com/v2';

    const body = {
      query:
        'query{ boards(limit:1, ids:5073094843) {id state name item_terminology items_page { items {name state group {title} column_values { column {title} text}}} workspace {id state name}} workspaces(limit:1, ids:2990734) {id state name}}',
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.configService.get<string>('MONDAY_TOKEN'),
      'Api-Version': '2023-10',
    };

    const config: AxiosRequestConfig = { headers: headers };
    const observable = this.httpService.post<ApiResponseType>(
      url,
      body,
      config,
    );

    return observable;
  }
}
