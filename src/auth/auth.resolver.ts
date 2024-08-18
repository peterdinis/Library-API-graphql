import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth-guard';
import { User } from '@prisma/client';
import { LoginUserType } from './dto/login-user.dto';
import { RegisterUserType } from './dto/register-user.dto';
import { UserModel } from './auth.model';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel)
  async me(@Args('email') email: string) {
    return this.authService.validateUser({ email });
  }

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { access_token } = await this.authService.login(user);
    return access_token;
  }

  @Mutation(() => UserModel)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name', { nullable: true }) name?: string,
  ) {
    return this.authService.register({ email, password, name });
  }
}