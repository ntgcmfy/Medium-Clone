import {
    Controller,
    Post,
    Body,
    HttpCode, 
    HttpStatus,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { UserResponse } from './dto/user-response.dto';

@Controller()
export class AuthController {
    constructor ( private readonly authService: AuthService ) {}

    // POST /api/users - Register new user
    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body('user', new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
        register: Register,
    ): Promise<{user: UserResponse}> {
        const user = await this.authService.register(register);  
        return { user };
    }

    //POST /api/users/login - Login user
    @Post('users/login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body('user', new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
        login: Login,
    ): Promise<{user: UserResponse}> {
        const user = await this.authService.login(login);
        return { user };
    }
}

