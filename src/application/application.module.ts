import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { BigQueryHandleService } from './bigQuery/bigQuery-handle.service';
import { CreateItemsService } from './bigQuery/items/create-items.service';
import { UpdateItemsService } from './bigQuery/items/update-items.service';
import { FilterItemsService } from './bigQuery/items/filter-items.service';

import { MondayHandleService } from './monday/monday-handle.service';

import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { CreateWorkspaceService } from './bigQuery/create/create-workspace.service';
import { CreateBoardsService } from './bigQuery/create/create-boards.service';
import { GetItemsService } from './bigQuery/items/get-items.service';
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
