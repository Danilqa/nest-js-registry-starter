export class TokenDto {
    token: string;

    constructor(data: TokenDto) {
        this.token = data.token;
    }
}
