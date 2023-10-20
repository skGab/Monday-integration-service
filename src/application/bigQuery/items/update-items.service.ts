import { Injectable } from '@nestjs/common';
import { Table } from '@google-cloud/bigquery';
import { SharedShape } from 'src/application/dtos/core/payload.dto';
import { RowRepository } from 'src/domain/repositories/bigQuery/row-repository';

@Injectable()
export class UpdateItemsService {
  constructor(private rowRepositoryService: RowRepository) {}

  async run(
    duplicateItems: { [key: string]: string }[],
    table: Table,
  ): Promise<SharedShape> {
    if (duplicateItems.length === 0) {
      // return { count: 0, status: 'Não ha items para serem atualizados' };
      return;
    }

    // UPDATE IMPLEMENTATION ON BIGQUERY
    const data = await this.rowRepositoryService.updateRows(
      duplicateItems,
      table,
    );

    return;
    // return { count: data.insertedPayload.length, status: 'Items atualizados' };
  }
}
