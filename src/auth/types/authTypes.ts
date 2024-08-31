import { Role } from "@prisma/client";

export type ValidatePayloadType = {
    sub: string;
    email: string;
    role: Role;
}

export type UserType = {
    email: string;
    id: number | string;
    role: Role;
}