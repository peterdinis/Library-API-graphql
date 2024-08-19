import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
    description = 'DateTime custom scalar type';

    parseValue(value: string): Date {
        return new Date(value); // Convert incoming string to Date
    }

    serialize(value: Date): string {
        return value.toISOString(); // Convert outgoing Date to string
    }

    parseLiteral(ast: ValueNode): Date {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    }
}
