import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsDate, IsDateString, IsOptional } from 'class-validator';

@InputType()
export class CreateAuthorInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    @IsDateString()
    litPeriod: Date;

    @Field()
    @IsString()
    @IsNotEmpty()
    litPeriodName: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    authorImage: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    birthYear: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    deathYear?: string;
}
