import { Role } from './role.enum';

export interface User {
    userId: number;
    name: string;
    lastName: String;
    username: string;
    password: string;
    roles: Role[];
}