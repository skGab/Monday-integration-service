import { Table } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { TransferResponse } from 'src/application/dtos/crud-operations.dto';

@Injectable()
export class InsertRowsService {
  private readonly logger = new Logger(InsertRowsService.name);

  async run(coreItems: any[], table: Table): Promise<TransferResponse> {
    await table.insert(coreItems);

    // When successful, return the table ID and the payload
    return {
      tableId: table.id,
      status: 'success',
      insertedPayload: coreItems,
    };
  }
}
