import { Module } from '@nestjs/common';
import { SendgridService } from '../services/sensdgrid.service';
import sendgridConfig from 'src/config/sendgrid.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [sendgridConfig],
    }),
  ],
  providers: [SendgridService],
  exports: [
    SendgridService,
  ],
})
export class SendgridModule {}