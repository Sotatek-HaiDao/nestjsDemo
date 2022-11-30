import {
  BadRequestException, Inject,
  Injectable, InternalServerErrorException, Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleLoginDto } from 'src/controllers/dto/auth/google-login.dto';
import { AuthDto } from 'src/controllers/dto/auth/auth.dto';
import { Connection, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { GoogleAuthService } from './google-auth.service'
import { RegisterDto } from '../controllers/dto/auth/register.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyEmailDto } from '../controllers/dto/auth/verify-email.dto';
import { RandomStringHelper } from 'src/helpers/random-string.helper';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BaseService } from './base.service';
import { constants } from '../constants/constant';
import verifyCodeConfig from '../config/verifyCode.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(verifyCodeConfig.KEY) private codeConfig: ConfigType<typeof verifyCodeConfig>,
    private connection: Connection,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    private readonly mailerService: MailerService,
    private readonly randomStringHelper: RandomStringHelper,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super();
  }

  // async validateAccount(email: string, pw: string): Promise<any> {
  //   if (!email || !pw) return null;
  //   const account = await this.loginRepos.findOne({ where: { email: email, isActive: true, emailVerified: true } });

  //   if (!account) return null;

  //   const matchPw = await bcrypt.compare(pw, account.password);
  //   if (matchPw) {
  //     return { id: account.id, email: account.email, loginType: account.loginType };
  //   }
  //   return null;
  // }

  // async login(body: AuthDto) {
  //   const account = await this.validateAccount(body.email, body.password);

  //   if (!account) throw new UnauthorizedException();

  //   const payload = await this.makePayload(account);

  //   return this.responseOk({
  //     access_token: this.jwtService.sign(payload),
  //   });
  // }

  // async googleSignIn(body: GoogleLoginDto) {
  //   let googleAuthPayload;
  //   try {
  //     googleAuthPayload = await this.googleAuthService.verify(body['idToken']);
  //   } catch (err) {
  //     this.logger.error(err.stack);

  //     throw new UnauthorizedException();
  //   }

  //   const email = googleAuthPayload['email'] || null;
  //   if (!email) {
  //     throw new BadRequestException('Email not found, please granted the "email" OAuth scopes to the application.');
  //   }

  //   let payload, account;
  //   account = await this.loginRepos.findOne({ where: { email: email } });
  //   if (!account) {
  //     // Case: Login
  //     if (!body.loginType) {
  //       throw new NotFoundException('Email is not registered.');
  //     }

  //     // Case: Register
  //     const queryRunner = this.connection.createQueryRunner();
  //     await queryRunner.connect();
  //     await queryRunner.startTransaction();
  //     try {
  //       const filterData = {
  //         email: email,
  //         loginType: body.loginType,
  //         emailVerified: true,
  //       }
  //       account = await queryRunner.manager.save(Login, filterData);

  //       const user = {
  //         login: account.id,
  //         registrationDate: new Date(),
  //         signupStep: signupStep.LOGIN_TYPE,
  //       }
  //       if (account.loginType == loginType.TL) {
  //         await queryRunner.manager.save(Talent, user);
  //       } else {
  //         const emFirstName = googleAuthPayload['given_name'] || '';
  //         const emLastName = googleAuthPayload['family_name'] || '';
  //         const emFullName = `${emFirstName} ${emLastName}`;
  //         user['companyRole'] = CompanyRole.ADMIN;
  //         user['fullName'] = emFullName.trim();
  //         await queryRunner.manager.save(Employer, user);
  //       }

  //       await queryRunner.commitTransaction();
  //     } catch (err) {
  //       this.logger.error(err.stack);
  //       await queryRunner.rollbackTransaction();

  //       throw new BadRequestException('Register failed.');
  //     } finally {
  //       await queryRunner.release();
  //     }
  //   }
  //   if (account.isActive == false) {
  //     throw new UnauthorizedException('Account has been locked.');
  //   }

  //   payload = await this.makePayload(account);

  //   return this.responseOk({
  //     access_token: this.jwtService.sign(payload),
  //   });
  // }

  // public async makePayload(account) {
  //   const userId = account.id;
  //   const payload = {
  //     sub: userId,
  //     email: account.email || "",
  //     loginType: account.loginType || "",
  //   };
  //   if (account.loginType == loginType.TL) {
  //     const talent = {signupStep: 2, fullName: 'asdsa'}
  //     payload['signupStep'] = talent.signupStep;
  //     payload['fullName'] = talent.fullName;
  //   }
  //   if (account.loginType == loginType.EM) {
  //     const employer = {onboardStep: 2, fullName: 'asdsa',companyRole: 1}
  //     payload['onboardStep'] = employer.onboardStep;
  //     payload['fullName'] = employer.fullName;
  //     payload['companyRole'] = employer.companyRole;
  //   }

  //   return payload;
  // }

  // async register(body: RegisterDto) {
  //   const hasAccount = await this.loginRepos.findOne({ where: { email: body.email } });
  //   if (hasAccount) {
  //     throw new BadRequestException('Account already exists.');
  //   }

  //   let account;
  //   const queryRunner = this.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const salt = await bcrypt.genSalt();
  //     const password = await bcrypt.hash(body.password, salt);
  //     const code = this.randomStringHelper.makeCode(this.codeConfig.length);
  //     let expired = this.makeExpired(this.codeConfig.expired_number, this.codeConfig.expired_unit);

  //     // Save account
  //     const accountData = {
  //       email: body.email,
  //       password: password,
  //       loginType: body.loginType,
  //       emailVerified: true
  //     }

  //     account = await queryRunner.manager.save(Login, accountData);

  //     // Save information
  //     const info = {
  //       fullName: body.fullName,
  //       login: account.id,
  //       registrationDate: new Date()      
  //     }
  //     if (account.loginType == loginType.TL) {
  //       info['phoneNumber'] = body.phoneNumber;
  //       info['signupStep'] = signupStep.LOGIN_TYPE
  //       await queryRunner.manager.save(Talent, info);
  //     } else {
  //       info['onboardStep'] = employerOnboardStep.CREATE_COMPANY
  //       await queryRunner.manager.save(Employer, info);
  //     }

  //     await queryRunner.commitTransaction();

  //     return this.responseOk();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     this.logger.error(err);

  //     throw new InternalServerErrorException();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // async verifyEmail(body: VerifyEmailDto) {
  //   const account = await this.loginRepos.findOne({ where: { email: body.email } });
  //   if (!account) {
  //     throw new NotFoundException('Account not found.');
  //   }
  //   const verify = await this.confirmationService.__verifyCode(account.email, body.code, userConfirmationType.VERIFY_EMAIL);
  //   if (verify['statusCode'] != 200) {
  //     return this.responseErr(verify['statusCode'], verify['message']);
  //   }
  //   const confirmation = verify['data'];

  //   const queryRunner = this.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     // Update account
  //     account.emailVerified = true;
  //     await queryRunner.manager.save(Login, account);
  //     // Delete confirm information
  //     await queryRunner.manager.update(UserConfirmation, confirmation, {
  //       code: null,
  //       expired: null,
  //     });
  //     await queryRunner.commitTransaction();

  //     return this.responseOk();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //     this.logger.error(err.stack);

  //     throw new InternalServerErrorException();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

}
