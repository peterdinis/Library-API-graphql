import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoryInput } from './create-category-type';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
