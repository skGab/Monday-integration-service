import { FechBoardsService } from './services/fetch-boards.service';
import { BigQuerySetupService } from './../bigQuery/bigQuery-setup.service';
import { InsertionHandleService } from './services/insertion-handle.service';
import { HandleBigQueryWorkspacesService } from './../workspace/handleBigQuery-workspaces.service';
import { Injectable } from '@nestjs/common';
import { Payload } from 'src/domain/response/payload';

@Injectable()
export class TransferBoardsUsecase {
  private payload: Payload;

  constructor(
    private fechBoardsService: FechBoardsService,
    private handleBigQueryWorkspacesService: HandleBigQueryWorkspacesService,
    private insertionHandleService: InsertionHandleService,
    private bigQuerySetupService: BigQuerySetupService,
  ) {
    this.payload = new Payload();
  }

  async run() {
    try {
      // Handle Monday workspaces and update payload
      await this.handleBigQueryWorkspacesService.run(this.payload);

      // Fetch Monday boards and update payload
      const boardsStatus = await this.fechBoardsService.run(this.payload);

      // If fetching Monday boards was successful, proceed to setup BigQuery boards
      if (boardsStatus.success) {
        const setupStatus = await this.bigQuerySetupService.run(
          this.payload,
          boardsStatus.data,
        );

        // Setup columns and tables and insertion
        await this.insertionHandleService.run(this.payload, setupStatus.data);
      }

      // Log the final payload
      console.log(this.payload);
      return this.payload;
    } catch (error) {
      // If any general error occurs, update payload and return
      this.payload.updateStatus({
        step: 'General',
        success: false,
        error: error.message,
      });
      return this.payload;
    }
  }
}
