import { Module } from '@nestjs/common';
import { BoardController } from './board/board.controller';
import { InfrastructureModule } from 'src/infra/infrastructure.module';
import { TransferBoardsUsecase } from './board/transfer-boards-usecase.service';
import { WorkSpacesValidator } from './board/workspace/workSpaces-validator.service';
import { SanitizeColumnService } from './board/column/sanitize-column.service';
import { PrepareItemsService } from './board/item/prepare-items.service';

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
