import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';

@Injectable()
export class CreateItemsService {
  constructor(private rowRepositoryService: RowRepository) {}

  // HANDLE NEW ITEMS
  async run(
    coreItems: { [key: string]: string }[],
    table: Table,
  ): Promise<SharedShape> {
    // FAST EXIST IF ANY NEW DATA TO INSERT
    if (coreItems.length === 0) {
      // return {
      //   count: 0,
      //   status: 'Não ha novos items para inserção',
      // };

      return;
    }

    const response = await this.rowRepositoryService.createRows(
      coreItems,
      table,
    );

    // return {
    //   count: data.insertedPayload.length,
    //   status: 'Novos items inseridos',
    // };

    return;
  }
}
