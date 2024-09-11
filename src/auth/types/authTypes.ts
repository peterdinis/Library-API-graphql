import { User } from '@prisma/client';

export type AuthPayload = {
    accessToken: string;
    user: User;
};
