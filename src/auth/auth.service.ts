import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.userService.create({
            ...dto,
            password: hashed,
        });
        return this.token(user.id);
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('User not found');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid password');

        return this.token(user.id);
    }

    private token(userId: string) {
        const payload = { sub: userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
