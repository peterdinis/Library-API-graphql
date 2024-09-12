import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserType } from './dto/login-user.dto';
import { RegisterUserType } from './dto/register-user.dto';
import { Roles } from 'src/utils/applicationRoles';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async findOneUserById(userId: number) {
        const findOneUser = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!findOneUser) {
            throw new NotFoundException('User not found');
        }

        return findOneUser;
    }

    async findAllTeachers() {
        const teachers = await this.prisma.user.findMany({
            where: {
                role: "TEACHER",
            },
            include: {
                borrowedBooks: true,
            },
        });

        if (!teachers) {
            throw new NotFoundException('No teachers found');
        }

        return teachers;
    }

    async findAllStudents() {
        const students = await this.prisma.user.findMany({
            where: {
                role: "STUDENT",
            },
            include: {
                borrowedBooks: true,
            },
        });

        if (!students) {
            throw new NotFoundException('No students found');
        }

        return students;
    }

    async getOneUser(userId: number) {
        const findOneUser = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!findOneUser) {
            throw new NotFoundException('User not found');
        }

        return findOneUser;
    }

    async register(input: RegisterUserType) {
        const { email, password, ...rest } = input;
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                ...rest,
                email,
                password: hashedPassword,
            },
        });
    }

    async login(input: LoginUserType) {
        const { email, password } = input;
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    async generateJwt(user: User) {
        return this.jwtService.signAsync({ userId: user.id });
    }
}
