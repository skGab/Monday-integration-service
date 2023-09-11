import { Workspaces } from './../../domain/factory/types';
import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Board } from 'src/domain/entities/board';

import { GetBoardsService } from '../services/get-boards.service';
import { TransferBoardService } from '../services/transfer-boards.service';
import { EventHandleService } from '../events/event-handle.service';
import { Dataset } from '@google-cloud/bigquery';
import { GetWorkSpacesService } from '../services/get-workspaces.service';

@Controller('boards')
export class BoardController {
  constructor(
    readonly errorHandling: EventHandleService,
    private getBoardsService: GetBoardsService,
    private getWorkSpacesService: GetWorkSpacesService,
    private transferBoardsService: TransferBoardService,
  ) {}

  @Get('transfer')
  async transferBoardsToBigQuery() {
    try {
      // const boards = await this.getBoardsService.run();
      const Workspaces = await this.getWorkSpacesService.run();

      // const response = await this.transferBoardsService.createWorkSpaces(
      //   Workspaces,
      // );

      return Workspaces;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error durante a transferencia de quadros',
        },

        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  // SERVICE LOGS
  @Get('logs')
  async getBoardsFromMonday(): Promise<Board[]> {
    try {
      const boards = await this.getBoardsService.run();
      return boards;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error durante a busca de quadros',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
