import { Module } from '@nestjs/common';
import { BoardController } from './controllers/board.controller';
import { TransferBoardService } from './services/transfer-boards.service';
import { InfrastructureModule } from 'src/infra/infrastructure.module';

@Module({
  // CONTROLLERS
  controllers: [BoardController],

  // SERVICES
  providers: [TransferBoardService],

  imports: [InfrastructureModule],
})
export class ApplicationModule {}
