import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class Register {
    @IsEmail({}, { message: 'Invalid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'Username must be a string' })
    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    username: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}