import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterUserType } from './dto/register-user.dto';
import { UserModel } from './models/auth.model';
import { LoginUserType } from './dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthPayload } from './types/authTypes';

@Resolver(() => UserModel)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterUserType): Promise<AuthPayload> {
    const user = await this.authService.register(input);
    const accessToken = await this.authService.generateJwt(user);
    return { accessToken, user };
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginUserType): Promise<AuthPayload> {
    const user = await this.authService.login(input);
    const accessToken = await this.authService.generateJwt(user);
    return { accessToken, user };
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: User): Promise<User> {
    return this.authService.getOneUser(user.id);
  }

    @Query(() => UserModel)
    async getOneUser(@Args('id') id: number) {
        return this.authService.getOneUser(id);
    }
}
