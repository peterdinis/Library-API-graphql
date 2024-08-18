import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './startegies/jwt.strategy';

@Module({
    imports: [
      PrismaModule,
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60m' },
        }),
        inject: [ConfigService],
      }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
  })
export class AuthModule {}