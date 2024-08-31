import { InputType, Field } from '@nestjs/graphql';
import {
    IsString,
    IsDate,
    IsNotEmpty,
    IsDateString,
    IsOptional,
} from 'class-validator';

@InputType()
export class CreatePublisherInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    @IsDateString()
    createdYear: Date;

    @Field()
    @IsDate()
    @IsOptional()
    deletedYear?: Date;
}
