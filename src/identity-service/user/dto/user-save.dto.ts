import { UserRole } from '../user.enums';

export class UserSaveDto {
    name: string;
    password: string;
    role: UserRole;

    constructor(props: UserSaveDto) {
        this.name = props.name;
        this.password = props.password;
        this.role = props.role;
    }
}
