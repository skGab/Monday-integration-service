import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { BigQueryHandleService } from './bigQuery/bigQuery-handle.service';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { TransferItemsService } from './bigQuery/utils/create-items.service';
import { UpdateItemsService } from './bigQuery/utils/update-items.service';
import { WorkspaceHandleService } from './monday/workspace-handle.service';
import { MondayHandleService } from './monday/monday-handle.service';
import { PerformCrudOperations } from './bigQuery/perform-CRUD.service';
import { PipeLineOrchestratorUsecase } from './usecase/pipeLine-orchestrator.service';
import { PayloadTransformationService } from './usecase/payload-transformation.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    PipeLineOrchestratorUsecase,

    MondayHandleService,
    WorkspaceHandleService,
    BigQueryHandleService,
    PerformCrudOperations,

    PayloadTransformationService,
    TransferItemsService,
    UpdateItemsService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
