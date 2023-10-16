import { Module } from '@nestjs/common';

import { IntegrationController } from './controllers/integration.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { CreateItemsService } from './bigQuery/items/create-items.service';
import { UpdateItemsService } from './bigQuery/items/update-items.service';
import { FilterItemsService } from './bigQuery/items/filter-items.service';

import { MondayHandleService } from './handles/monday-handle.service';

import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { CreateWorkspaceService } from './bigQuery/workspace/create-workspace.service';
import { CreateBoardsService } from './bigQuery/boards/create-boards.service';
import { GetItemsService } from './bigQuery/items/get-items.service';
import { CrudOnItemsService } from './bigQuery/crud-on-items.service';
import { GetWorkspacesService } from './bigQuery/workspace/get-workspaces.service';
import { UpdateBoardsService } from './bigQuery/boards/update-boards.service';
import { ItemsJobHandleService } from './handles/itemsJob-handle.service';
import { BoardsJobHandleService } from './handles/boardsJob-handle.service';
import { WorkspacesJobHandleService } from './handles/workspacesJob-handle.service';

@Module({
  // CONTROLLERS
  controllers: [IntegrationController, WorkSpaceController],

  // SERVICES
  providers: [
    PipeLineOrchestratorUsecase,

    MondayHandleService,
    CreateWorkspaceService,
    CrudOnItemsService,
    CreateBoardsService,
    GetItemsService,
    GetWorkspacesService,
    UpdateBoardsService,
    ItemsJobHandleService,
    BoardsJobHandleService,
    WorkspacesJobHandleService,

    FilterItemsService,
    CreateItemsService,
    UpdateItemsService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
