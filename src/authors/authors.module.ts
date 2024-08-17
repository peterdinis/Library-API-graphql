import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AuthorsService, AuthorsResolver],
})
export class AuthorsModule {}
