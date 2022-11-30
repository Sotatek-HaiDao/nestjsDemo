import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/guards/jwt.guard';
import { AuthService } from 'src/services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../controllers/auth.controller';
import { RandomStringHelper } from '../helpers/random-string.helper';
import verifyCodeConfig from '../config/verifyCode.config';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string | number>('jwt.expiresIn'),
        },
      }),
    }),
    TypeOrmModule.forFeature([
    ]),
    ConfigModule.forRoot({
      load: [verifyCodeConfig],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RandomStringHelper,
  ],
  exports: [AuthService],
})
export class AuthModule {}
