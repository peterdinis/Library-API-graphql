import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { parseISO, formatISO } from 'date-fns';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    // value from the client
    return parseISO(value);
  }

  serialize(value: Date): string {
    // value sent to the client
    return formatISO(value);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return parseISO(ast.value);
    }
    return null;
  }
}