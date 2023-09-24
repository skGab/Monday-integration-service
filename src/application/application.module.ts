import { Module } from '@nestjs/common';
import { BoardController } from './board/board.controller';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { TransferBoardsUsecase } from './board/transfer-boards-usecase.service';
import { HandleBigQueryWorkspacesService } from './workspace/handleBigQuery-workspaces.service';
import { WorkSpaceController } from './workspace/workspace.controller';
import { WorkSpaceNameValidator } from './workspace/workspaceName-validator';
import { BigQuerySetupService } from './bigQuery/bigQuery-setup.service';
import { InsertionHandleService } from './board/services/insertion-handle.service';
import { FechBoardsService } from './board/services/fetch-boards.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    TransferBoardsUsecase,
    InsertionHandleService,
    BigQuerySetupService,
    WorkSpaceNameValidator,
    HandleBigQueryWorkspacesService,
    FechBoardsService,
    // SchedulerService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
