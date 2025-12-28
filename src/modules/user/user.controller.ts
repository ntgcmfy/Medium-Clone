import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from '../auth/dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Request() req: any): Promise<{ user: UserResponse }> {
    const user = await this.userService.findById(req.user.id);
    if (!user) throw new Error('User not found');
    return { user: this.authService.buildUserResponse(user) };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Request() req: any,
    @Body('user', new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
  ): Promise<{ user: UserResponse }> {
    const user = await this.userService.updateUser(req.user.id, updateUserDto);
    return { user: this.authService.buildUserResponse(user) };
  }
}