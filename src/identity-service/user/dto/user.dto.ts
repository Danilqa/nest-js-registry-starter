import { UserRole } from '../user.enums';

export interface UserDto {
    id: string;
    name: string;
    role: UserRole;
}
