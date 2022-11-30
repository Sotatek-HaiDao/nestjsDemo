import { Body, Controller, Get, Post } from '@nestjs/common';
import { GoogleLoginDto } from './dto/auth/google-login.dto';
import { AuthService } from '../services/auth.service';
import { Public } from '../utils/decorators/public';
import { RegisterDto } from './dto/auth/register.dto';
import { AuthDto } from './dto/auth/auth.dto';
import { VerifyEmailDto } from './dto/auth/verify-email.dto';

@Public()
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  // @Post('google-login')
  // async googleLogin(@Body() body: GoogleLoginDto) {
  //   return this.authService.googleSignIn(body);
  // }

  // @Post('login')
  // async login(@Body() body: AuthDto) {
  //   return this.authService.login(body);
  // }

  // @Post('register')
  // async register(@Body() body: RegisterDto) {
  //   return this.authService.register(body);
  // }

  // @Post('verify-email')
  // async verifyEmail(@Body() body: VerifyEmailDto) {
  //   return this.authService.verifyEmail(body);
  // }
}
