import { Module } from '@nestjs/common';

import { IntegrationController } from './controllers/integration.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { CreateItemsService } from './bigQuery/items/create-items.service';
import { UpdateItemsService } from './bigQuery/items/update-items.service';
import { FilterItemsService } from './bigQuery/items/filter-items.service';

import { MondayHandleService } from './handles/monday-handle.service';
import { BigQueryHandleService } from './handles/bigQuery-handle.service';

import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { CreateWorkspaceService } from './bigQuery/workspace/create-workspace.service';
import { CreateBoardsService } from './bigQuery/create/create-boards.service';
import { GetItemsService } from './bigQuery/items/get-items.service';
import { CrudOnItemsService } from './bigQuery/crud-on-items.service';
import { GetWorkspacesService } from './bigQuery/workspace/get-workspaces.service';

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
    BigQueryHandleService,
    GetWorkspacesService,

    FilterItemsService,
    CreateItemsService,
    UpdateItemsService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
