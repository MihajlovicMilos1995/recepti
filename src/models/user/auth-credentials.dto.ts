import { IsString } from '@nestjs/class-validator';

export class AuthCredentialsDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
