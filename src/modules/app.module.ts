import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogHelper } from '../helpers/log.helper';
import "winston-daily-rotate-file";
import { BullModule } from '@nestjs/bull';
import queueConfig from 'src/config/queue.config';
import { MailConsumer } from '../queue/consumers/mail.consumer';
import { TaskModule } from './task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SendgridModule } from './sendgrid.module';
import path from 'path';
import { I18nModule } from 'nestjs-i18n';
import jwtConfig from '../config/jwt.config';

const logHelper = new LogHelper();
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        queueConfig,
        jwtConfig,
      ],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    TaskModule,
    SendgridModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT),
          secure: process.env.MAIL_SECURE === "true",
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.MAIL_FROM_NAME + "<"  + process.env.MAIL_FROM_ADDRESS + ">",
        },
        template: {
          dir: process.cwd() + '/src/templates/mailer',
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile(logHelper.winstonOptions('error')),
        new winston.transports.DailyRotateFile(logHelper.winstonOptions('debug')),
        new winston.transports.Console({
          handleExceptions: true,
          format: logHelper.consoleLogFormat(),
        })
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', '..', '/lang/'),
        watch: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MailConsumer,
  ],
})
export class AppModule {}
