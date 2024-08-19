import { InputType } from '@nestjs/graphql';
import { PaginationBookType } from 'src/book/dto/pagination-book-type';

@InputType()
export class PaginationAuthorType extends PaginationBookType {}
