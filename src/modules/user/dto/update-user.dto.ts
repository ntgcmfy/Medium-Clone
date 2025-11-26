import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Username must be a string' })
  @IsOptional()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  username?: string;

  @IsString({ message: 'Password must be a string' })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsString({ message: 'Bio must be a string' })
  @IsOptional()
  bio?: string;

  @IsString({ message: 'Image must be a string' })
  @IsOptional()
  image?: string;
}