import { Table } from '@google-cloud/bigquery';
import { Injectable } from '@nestjs/common';
import { TransferResponse } from 'src/application/dtos/bigQuery/items.dto';

@Injectable()
export class InsertRowsService {
  async run(coreItems: any[], table: Table): Promise<TransferResponse> {
    try {
      await table.insert(coreItems);

      return {
        tableId: table.id,
        status: 'success',
        insertedPayload: coreItems,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): void {
    console.log(`Error inserting rows into table: ${error.message}`);

    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err, index) => {
        console.log(`Error in row ${index}:`);

        if (err.errors && Array.isArray(err.errors)) {
          err.errors.forEach((subErr, subIndex) => {
            console.log(`  Sub-error ${subIndex}: ${subErr.message}`);
          });
        }

        console.log(`  Associated row: ${JSON.stringify(err.row)}`);
      });
    }

    if (error.response && error.response.insertErrors) {
      console.log('Insert errors:');
      console.log(JSON.stringify(error.response.insertErrors, null, 2));
    }
  }
}
