import { BigQuery } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { SharedShape } from 'src/application/dtos/core/payload.dto';

import { BoardEntity } from 'src/domain/entities/board/board-entity';

interface TableNameActivity {
  board_id: number;
  board_name: string;
  value: { name: string };
  previous_value: { name: string };
}

@Injectable()
export class UpdateTablesService {
  private versionMap: Record<string, number> = {};

  async run(
    oldTable: string,
    bigQuery: BigQuery,
    board: BoardEntity,
  ): Promise<string> {
    try {
     

      

      console.log(`Old table truncated: ${oldTable}`);

      return board.name;
    } catch (error) {
      console.log(error);
      return 'Error ao recriar tabelas';
    }
  }
}
