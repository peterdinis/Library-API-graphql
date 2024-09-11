import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserModel } from './auth.model';
import { LoginUserType } from './dto/login-user.dto';
import { RegisterUserType } from './dto/register-user.dto';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => UserModel)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Query(() => UserModel)
    async me(@Context('req') { headers }: { headers: { authorization: string } }) {
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

    @Query(() => UserModel)
    async getOneUser(@Args('id') id: number) {
        return this.authService.getOneUser(id);
    }

    @Mutation(() => UserModel)
    async login(@Args('loginUserDto') loginUserDto: LoginUserType): Promise<{ user: UserModel; access_token: string }> {
        const user = await this.authService.validateUser(loginUserDto);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { user: returnedUser, access_token } = await this.authService.login(user);

        // Return the user data and access token
        return { user: returnedUser as UserModel, access_token };
    }

    @Mutation(() => UserModel)
    async register(@Args('registerUserDto') registerUserDto: RegisterUserType) {
        return this.authService.register(registerUserDto);
    }
}