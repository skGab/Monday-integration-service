import { FechBoardsService } from './services/fetch-boards.service';
import { BigQuerySetupService } from './../bigQuery/bigQuery-setup.service';
import { InsertionHandleService } from './services/insertion-handle.service';
import { HandleBigQueryWorkspacesService } from './../workspace/handleBigQuery-workspaces.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransferBoardsUsecase {
  constructor(
    private fechBoardsService: FechBoardsService,
    private handleBigQueryWorkspacesService: HandleBigQueryWorkspacesService,
    private insertionHandleService: InsertionHandleService,
    private bigQuerySetupService: BigQuerySetupService,
  ) {}

  async run() {
    // Initialize payload to hold various pieces of data and statuses
    const payload = {
      bqTables: [],
      bqDatasets: [],
      mondayBoards: [],
      status: [],
    };

    try {
      // Handle Monday workspaces and update payload
      await this.handleBigQueryWorkspacesService.run(payload);

      // Fetch Monday boards and update payload
      const boardsStatus = await this.fechBoardsService.run(payload);

      // If fetching Monday boards was successful, proceed to setup BigQuery boards
      if (boardsStatus.success) {
        const setupStatus = await this.bigQuerySetupService.run(
          payload,
          boardsStatus.data,
        );

        // Setup columns and tables for BigQuery
        await this.insertionHandleService.run(payload, setupStatus.data);
      }

      // Log the final payload
      console.log(payload);
      return payload;
    } catch (error) {
      // If any general error occurs, update payload and return
      payload.status.push({
        step: 'General',
        success: false,
        error: error.message,
      });
      return payload;
    }
  }
}
