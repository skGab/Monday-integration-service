import { Injectable, Logger } from '@nestjs/common';
import { PreparePayload } from '../utils/prepare-payload';
import { BigQueryRepository } from 'src/domain/bigQuery/bigQuery-repository';
import { BoardVo } from 'src/domain/board/board-vo';

@Injectable()
export class PrepareBoardsService {
  constructor(private bigQueryRepository: BigQueryRepository) {}

  async run(boardTablePairs: { board: BoardVo; table: any }[]) {}
}
