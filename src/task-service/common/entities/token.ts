import { HttpException, HttpStatus } from '@nestjs/common';
import { decode } from 'jsonwebtoken';
import { UserDto } from '../../user/dto/user.dto';

export class Token {
    user: UserDto;

    constructor(data: Token) {
        this.user = data.user;
    }

    static createFromHeader(header: string): Token {
        const [, token] = header?.split(' ');
        if (!token) {
            throw new HttpException('Token is not provided', HttpStatus.UNAUTHORIZED);
        }

        const decodedRawToken = decode(token, { json: true }) || {};
        const user = decodedRawToken.data.user as UserDto;

        return new Token({ user });
    }
}
