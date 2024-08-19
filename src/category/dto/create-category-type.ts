import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsDate, IsNotEmpty, IsDateString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    @IsDateString()
    createdAt: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    @IsDateString()
    updatedAt: string;
    createdYear;
}
