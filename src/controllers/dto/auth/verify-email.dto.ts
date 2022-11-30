import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
