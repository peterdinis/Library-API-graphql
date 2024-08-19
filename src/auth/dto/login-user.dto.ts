import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType({
    isAbstract: true,
})
export class LoginUserType {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @Field()
    @IsString()
    @IsNotEmpty()
    password: string;
    @Field()
    @IsString()
    @IsNotEmpty()
    role: Role;
}
