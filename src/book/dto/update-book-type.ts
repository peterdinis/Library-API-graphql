import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBookInput } from './create-book-type';

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {}