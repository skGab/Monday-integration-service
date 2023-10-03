import { Module } from '@nestjs/common';

// LAYERS
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infra/infrastructure.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ApplicationModule,
    InfrastructureModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
