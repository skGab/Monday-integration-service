import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { FetchBoardsService } from './services/fetch-boards.service';
import { CreateWorkspaces } from './services/bigQuery/create-workspaces.service';

import { InsertionHandleService } from './usecase/handles/insertion-handle.service';
import { TransferUsecase } from './usecase/transfer-usecase.service';
import { BigQueryHandleService } from './usecase/handles/bigQuery-handle.service';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

@Module({
  // CONTROLLERS
  controllers: [BoardController, WorkSpaceController],

  // SERVICES
  providers: [
    TransferUsecase,
    InsertionHandleService,
    BigQueryHandleService,
    CreateWorkspaces,
    FetchBoardsService,
    // SchedulerService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
