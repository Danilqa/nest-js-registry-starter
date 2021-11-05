import { UserRole } from '../user.enums';

export interface UserSaveDto {
    name: string;
    password: string;
    role: UserRole;
}
