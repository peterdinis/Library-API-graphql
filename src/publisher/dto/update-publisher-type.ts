import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsDate } from 'class-validator';

@InputType()
export class UpdatePublisherInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    deletedYear?: Date;
}
