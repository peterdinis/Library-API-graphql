import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth-guard';
import { UserModel } from './auth.model';
import { LoginUserType } from './dto/login-user.dto';
import { RegisterUserType } from './dto/register-user.dto';

@Resolver(() => UserModel)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(GqlAuthGuard)
    @Query(() => UserModel)
    async me(
        @Context('req') { headers }: { headers: { authorization: string } },
    ) {
        const token = headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        const user = await this.authService.getCurrentUser(token);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    @Mutation(() => UserModel)
    async login(
        @Args('loginUserDto') loginUserDto: LoginUserType,
    ){
        const user = await this.authService.validateUser(loginUserDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { access_token } = await this.authService.login(user);
        return access_token;
    }

    @Mutation(() => UserModel)
    async register(
        @Args('registerUserDto') registerUserDto: RegisterUserType,
    ) {
        return this.authService.register(registerUserDto);
    }
}
