import { IsOptional, IsString } from '@nestjs/class-validator';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  role: number;

  //   @IsString()
  //   firstName: string;

  //   @IsString()
  //   lastName: string;
}
