import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';
import { BoardEntity } from 'src/domain/entities/board/board-entity';
import { Injectable } from '@nestjs/common';
import { ItemsJobStatusDto } from '../dtos/bigQuery/item-job-status.dto';

@Injectable()
export class ItemsJobHandleService {
  constructor(private rowRepositoryService: RowRepository) {}

  // 3 - HANDLE Items
  async handle(mondayBoards: BoardEntity[]): Promise<ItemsJobStatusDto> {
    // FAST EXIST IF ANY NEW DATA TO INSERT
    if (mondayBoards?.length == 0) {
      return new ItemsJobStatusDto(
        'Nenhum Board ou Items encontrados para inserção de dados',
      );
    }

    // INSERTING  ITEMS
    const operationStatus = await this.rowRepositoryService.createRows(
      mondayBoards,
    );

    return new ItemsJobStatusDto(operationStatus);
  }
}
