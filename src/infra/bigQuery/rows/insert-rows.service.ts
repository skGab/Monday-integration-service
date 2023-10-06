import { Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { TransferResponse } from 'src/application/bigQuery/dtos/crud-operations.dto';

@Injectable()
export class InsertRowsService {
  async run(coreItems: any[], table: Table): Promise<TransferResponse> {
    await table.insert(coreItems);

    return {
      tableId: table.id,
      status: 'success',
      insertedPayload: coreItems,
    };
  }
}
