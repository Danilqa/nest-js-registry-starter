import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDataDto } from './dto/login-data-dto';
import { TokenDto } from './dto/token.dto';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
    private static TOKEN_SECRET = 'e7c9e7c0385a8ab89768aaf035c82877';

    constructor(private readonly userService: UserService) {
    }

    async verifyToken(data: TokenDto): Promise<void> {
        try {
            verify(data.token, AuthService.TOKEN_SECRET);
        } catch (e) {
            throw new HttpException('Token is not valid', HttpStatus.UNAUTHORIZED);
        }
    }

    async login(data: LoginDataDto): Promise<TokenDto> {
        const user = await this.userService.auth(data.name, data.password);
        const token = sign({ data: { user } }, AuthService.TOKEN_SECRET, { expiresIn: '2w' });
        return { token };
    }
}
