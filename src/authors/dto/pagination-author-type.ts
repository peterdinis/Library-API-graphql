import { ObjectType } from "@nestjs/graphql";
import { PaginationBookType } from "src/book/dto/pagination-book-type";

@ObjectType()
export class PaginationAuthorType extends PaginationBookType {}