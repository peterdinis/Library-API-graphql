import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { parseISO, formatISO } from 'date-fns';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'DateTime custom scalar type';

  parseValue(value: string): Date {
    // Convert incoming string to Date using date-fns
    return parseISO(value);
  }

  serialize(value: Date): string {
    // Convert outgoing Date to ISO string using date-fns
    return formatISO(value);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return parseISO(ast.value);
    }
    return null;
  }
}