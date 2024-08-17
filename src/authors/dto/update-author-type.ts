import { ObjectType } from '@nestjs/graphql';
import { CreateAuthorInput } from './create-author-type';

@ObjectType()
export class UpdateAuthorType extends CreateAuthorInput {}
