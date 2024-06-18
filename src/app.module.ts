import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from '@config/app.config';
import { ConfigModule } from '@nestjs/config';
import { LeadsModule } from '@src/leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [appConfig],
    }),

    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
