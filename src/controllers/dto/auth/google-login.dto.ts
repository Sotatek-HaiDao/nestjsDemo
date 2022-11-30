import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  idToken: string;

  @IsNumber()
  @IsOptional()
  loginType: number;
}
