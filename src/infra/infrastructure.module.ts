import { Module } from '@nestjs/common';
import { MondayService } from './api/monday.service';
import { BoardsRepository } from './repositories/boards-repository';
import { IBoardsRepository } from 'src/domain/repositories/iboards-repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  // CONFIGURATION
  imports: [
    HttpModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],

  // SERVICES
  providers: [
    MondayService,
    {
      provide: IBoardsRepository,
      useClass: BoardsRepository,
    },
  ],

  exports: [IBoardsRepository],
})
export class InfrastructureModule {}
