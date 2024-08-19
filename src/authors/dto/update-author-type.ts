import { InputType } from '@nestjs/graphql';
import { CreateAuthorInput } from './create-author-type';

@InputType()
export class UpdateAuthorType extends CreateAuthorInput {}
