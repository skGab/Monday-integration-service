import { Module } from '@nestjs/common';

// LAYERS
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infra/infrastructure.module';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
})
export class AppModule {}
