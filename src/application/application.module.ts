import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { BigQueryHandleService } from './handles/bigQuery-handle.service';
import { CreateItemsService } from './bigQuery/crud/create-items.service';
import { UpdateItemsService } from './bigQuery/crud/update-items.service';
import { FilterItemsService } from './bigQuery/utils/filter-items.service';

import { MondayHandleService } from './handles/monday-handle.service';

import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { CreateWorkspaceService } from './bigQuery/crud/create-workspace.service';
import { CreateBoardsService } from './bigQuery/crud/create-boards.service';
import { GetItemsService } from './bigQuery/crud/get-items.service';
import { CrudOnItemsService } from './bigQuery/crud-on-items.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    PipeLineOrchestratorUsecase,

    MondayHandleService,
    CreateWorkspaceService,
    BigQueryHandleService,
    CrudOnItemsService,
    CreateBoardsService,
    GetItemsService,

    FilterItemsService,
    CreateItemsService,
    UpdateItemsService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
