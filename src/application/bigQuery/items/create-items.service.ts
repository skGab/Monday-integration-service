import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { ItemsOperation } from 'src/application/dtos/bigQuery/item-job-status.dto';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';

@Injectable()
export class CreateItemsService {
  constructor(private rowRepositoryService: RowRepository) {}

  // HANDLE NEW ITEMS
  async run(mondayBoards: BoardEntity[]): Promise<ItemsOperation[]> {
    const responses = await this.rowRepositoryService.createRows(mondayBoards);

    return;
  }
}
