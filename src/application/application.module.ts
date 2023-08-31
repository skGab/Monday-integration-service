import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { ErrorHandlingService } from './services/error-handling.service';
import { GetBoardsService } from './services/get-boards.service';
import { GetUseCase } from './usecases/get-usecase';
import { InfrastructureModule } from 'src/infra/infrastructure.module';

@Module({
  imports: [InfrastructureModule],

  // CONTROLLERS
  controllers: [BoardController],

  // SERVICES
  providers: [GetBoardsService, GetUseCase, ErrorHandlingService],
})
export class ApplicationModule {}
