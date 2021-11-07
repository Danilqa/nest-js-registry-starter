import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDataDto } from './dto/login-data-dto';
import { TokenDto } from './dto/token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {
    }

    async verifyToken(data: string): Promise<void> {
        try {
            const [, token] = data.split(' ');
            this.jwtService.verify(token);
        } catch (e) {
            throw new HttpException('Token is not provided or valid', HttpStatus.UNAUTHORIZED);
        }
    }

    async login(data: LoginDataDto): Promise<TokenDto> {
        const user = await this.userService.auth(data.name, data.password);
        const token = this.jwtService.sign({ data: { user } });
        return { token };
    }
}
