import { Module } from '@nestjs/common';

import { BoardController } from './controllers/board.controller';
import { WorkSpaceController } from './controllers/workspace.controller';

import { FetchBoardsService } from './usecase/handles/fetch-boards.service';
import { CreateWorkspaces } from './usecase/handles/create-workspaces.service';
import { InsertionHandleService } from './usecase/handles/insertion-handle.service';
import { TransferUsecase } from './usecase/transfer-usecase.service';
import { BigQueryHandleService } from './usecase/handles/bigQuery-handle.service';

import { InfrastructureModule } from 'src/infra/infrastructure.module';

import { TransferItemsService } from './services/bigQuery/transfer-items.service';
import { UpdateItemsService } from './services/bigQuery/update-items.service';
import { FilterDuplicatesService } from './services/filter-duplicates.service';

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

    TransferItemsService,
    UpdateItemsService,
    FilterDuplicatesService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
