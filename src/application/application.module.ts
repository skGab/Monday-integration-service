import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { TransferBoardsUsecase } from './usecase/transfer-boards-usecase.service';
import { WorkSpacesValidator } from './services/workSpaces-validator.service';
import { PrepareItemsService } from './services/prepare-items.service';
import { SanitizeColumnService } from './services/sanitize-column.service';

@Module({
  // CONTROLLERS
  controllers: [BoardController],

  // SERVICES
  providers: [
    TransferBoardsUsecase,
    WorkSpacesValidator,
    PrepareItemsService,
    SanitizeColumnService,
  ],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
