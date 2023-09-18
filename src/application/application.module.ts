import { Module } from '@nestjs/common';
import { BoardController } from './board/board.controller';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { TransferBoardsUsecase } from './board/transfer-boards-usecase.service';
import { SanitizeColumnService } from './board/utils/sanitize-column.service';
import { PrepareItemsService } from './board/utils/prepare-items.service';
import { HandleBigQueryWorkspacesService } from './workspace/handleBigQuery-workspaces.service';
import { WorkSpaceController } from './workspace/workspace.controller';
import { WorkSpaceNameValidator } from './workspace/workspaceName-validator.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    TransferBoardsUsecase,
    WorkSpaceNameValidator,
    PrepareItemsService,
    SanitizeColumnService,
    HandleBigQueryWorkspacesService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
