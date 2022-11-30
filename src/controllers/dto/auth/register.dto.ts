import { IsEmail, IsEnum, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  loginType: number;

  @IsString()
  verifyEmailRedirectUri: string;
}