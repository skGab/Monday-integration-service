import { Module } from '@nestjs/common';
import { BoardController } from './board/board.controller';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { TransferBoardsUsecase } from './board/transfer-boards-usecase.service';
import { HandleBigQueryWorkspacesService } from './workspace/handleBigQuery-workspaces.service';
import { WorkSpaceController } from './workspace/workspace.controller';
import { WorkSpaceNameValidator } from './workspace/workspaceName-validator.service';
import { PrepareBoardsService } from './board/prepare-boards.service';
import { BigQuerySetupService } from './bigQuery/bigQuery-setup.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    TransferBoardsUsecase,
    PrepareBoardsService,
    BigQuerySetupService,
    WorkSpaceNameValidator,
    HandleBigQueryWorkspacesService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
