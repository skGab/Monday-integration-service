import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { WorkspaceEntity } from 'src/domain/entities/board/workspace-entity';

export interface BoardResponseVo {
  data: {
    boards: BoardEntity[];
  };
  account_id: number;
}
export interface WorkspaceResponseVo {
  data: {
    workspaces: WorkspaceEntity[];
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

export type WorkspaceResponseType = WorkspaceResponseVo | ErrorResponse;

export type BoardResponseType = BoardResponseVo | ErrorResponse;

@Injectable()
export class ApiCallService {
  private url = 'https://api.monday.com/v2';
  private headers = {
    'Content-Type': 'application/json',
    Authorization: this.configService.get<string>('MONDAY_TOKEN'),
    'Api-Version': '2023-10',
  };

  private config: AxiosRequestConfig = { headers: this.headers };

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  callBoards() {
    // BUILD QUERY
    const body = {
      query:
        'query{ boards {type id state name items_page { items {name state group {title} column_values { column {title} text}}} activity_logs {event data} workspace {id state name}}}',
    };

    // MAKING REQUEST
    const observable = this.httpService.post<BoardResponseType>(
      this.url,
      body,
      this.config,
    );

    return observable;
  }

  callWorkspaces() {
    // BUILD QUERY
    const body = {
      query: 'query{ workspaces {id state name}}',
    };

    // GETTING WORKSPACES
    const observable = this.httpService.post<WorkspaceResponseType>(
      this.url,
      body,
      this.config,
    );

    return observable;
  }
}
