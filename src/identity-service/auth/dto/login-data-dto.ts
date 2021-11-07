export class LoginDataDto {
    name: string;
    password: string;

    constructor(data: LoginDataDto) {
        this.name = data.name;
        this.password = data.password;
    }
}
