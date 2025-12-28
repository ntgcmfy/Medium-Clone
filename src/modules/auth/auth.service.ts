import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Register } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}
    
    //Register user

    async register(register: Register): Promise<UserResponse> {
        const { email, username, password } = register;

        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException('Email is already in use');
            }
            if (existingUser.username === username) {
                throw new ConflictException('Username is already in use');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(newUser);
        return this.buildUserResponse(savedUser);
    }

    //Login user

    async login(login: Login): Promise<UserResponse> {
        const { email, password } = login;

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return this.buildUserResponse(user);
    }

    public buildUserResponse(user: User): UserResponse {
        const token = this.generateJwt(user);

        return new UserResponse({
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
            token,
        });
    }

    private generateJwt(user: User): string {
        return this.jwtService.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        });
    }
    
}

