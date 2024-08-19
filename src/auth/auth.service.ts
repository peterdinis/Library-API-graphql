import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserType } from './dto/login-user.dto';
import { RegisterUserType } from './dto/register-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(
        loginDto: LoginUserType,
    ): Promise<Omit<User, 'password'> | null> {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (user && bcrypt.compareSync(loginDto.password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(
        user: Omit<User, 'password'>,
    ): Promise<{ access_token: string }> {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterUserType): Promise<User> {
        const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
        return this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
            },
        });
    }

    async getCurrentUser(
        token: string,
    ): Promise<Omit<User, 'password'> | null> {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { email: decoded.email },
            });
            if (user) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
