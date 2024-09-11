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
import { Role } from '@prisma/client';

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
                role: Roles.TEACHER as unknown as Role,
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
                role: Roles.STUDENT as unknown as Role,
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
}
