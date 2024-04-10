import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from '@nestjs/class-validator';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  role: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;
}
