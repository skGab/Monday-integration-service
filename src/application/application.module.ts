import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { BigQueryHandleService } from './bigQuery/bigQuery-handle.service';
import { PerformCrudService } from './bigQuery/perform-crud.service';
import { CreateItemsService } from './bigQuery/utils/create-items.service';
import { UpdateItemsService } from './bigQuery/utils/update-items.service';
import { PayloadTransformationService } from './bigQuery/utils/payload-transformation.service';

import { MondayHandleService } from './monday/monday-handle.service';

import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { CreateWorkspaceService } from './bigQuery/utils/create-workspace.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    PipeLineOrchestratorUsecase,

    MondayHandleService,
    CreateWorkspaceService,
    BigQueryHandleService,
    PerformCrudService,

    PayloadTransformationService,
    CreateItemsService,
    UpdateItemsService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
