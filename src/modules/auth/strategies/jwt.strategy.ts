import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET') as string,
        });
    }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
        where: { id: payload.id} 
    });

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    return user;
  }
}