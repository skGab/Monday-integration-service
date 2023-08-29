import { Injectable } from '@nestjs/common';
import { Board } from 'src/domain/entities/board';

type HeadersProps = {
  contentType: string;
  authorization: string;
  apiVersion: string;
};

type bodyProps = {
  query: string;
};
abstract class IService {
  method: string;
  headers: HeadersProps;
  body: bodyProps;

  abstract run(): Promise<Board[] | null>;
}

@Injectable()
export class MondayService implements IService {
  private constructor(
    private method: string,
    private headers: HeadersProps,
    private body: bodyProps,
  ) {}

  async run(): Promise<Board[] | null> {
    const headers = {
      contentType: 'application/json',
      authorization: 'api-key',
      apiVersion: '2023-04',
    };

    const body = {
      query: 'query{boards (limit:1) {id name} }',
    };

    const mondayService = new MondayService('post', headers, body);
    const boards = fetch(
      'https://api.monday.com/v2',
      mondayService.method,
      mondayService.headers,
      mondayService.body,
    );

    return boards;
  }
}
