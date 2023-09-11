import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { GetBoardsService } from './services/get-boards.service';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { EventHandleService } from './events/event-handle.service';
import { TransferBoardService } from './services/transfer-boards.service';
import { GetWorkSpacesService } from './services/get-workspaces.service';

@Module({
  imports: [InfrastructureModule],

  // CONTROLLERS
  controllers: [BoardController],

  // SERVICES
  providers: [
    GetBoardsService,
    GetWorkSpacesService,
    TransferBoardService,
    EventHandleService,
  ],
})
export class ApplicationModule {}
